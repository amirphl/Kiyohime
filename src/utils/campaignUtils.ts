/**
 * Campaign utility functions for character counting, validation, and calculations
 */

/**
 * Counts characters in text with proper weighting for different character types
 * English characters and numbers = 1, others (Farsi, Arabic, etc.) = 2
 * Excludes the link placeholder character (🔗) from counting
 */
export const countCharacters = (text: string): number => {
	if (!text) return 0;

	// Remove the link character (🔗) before counting
	const textWithoutLinkChar = text.replace(/🔗/g, '');

	let count = 0;
	for (let i = 0; i < textWithoutLinkChar.length; i++) {
		const char = textWithoutLinkChar.charCodeAt(i);
		// Check if character is English (ASCII range 32-126)
		if (char >= 32 && char <= 126) {
			count += 1; // English character
		} else {
			count += 2; // Non-English character (Farsi, Arabic, etc.)
		}
	}
	return count;
};

/**
 * Calculates the total character count including backend additions
 * @param userText - The user's input text
 * @param insertLink - Whether link insertion is enabled
 * @returns Object with total count, start count, and max characters
 */
export const calculateTotalCharacterCount = (userText: string, insertLink: boolean) => {
	const backendAppendChars = 6; // Backend appends 6 characters
	const shortenedLinkChars = 14; // Shortened link takes 14 characters
	const maxCharacters = 330; // Maximum total characters allowed

	const characterCount = countCharacters(userText);
	let startCount: number;

	if (insertLink) {
		// Check if link character is present in text
		if (userText && userText.includes('🔗')) {
			// Link character will be replaced by shortened link (14 chars) + backend append (6 chars)
			startCount = shortenedLinkChars + backendAppendChars; // 20 chars
		} else {
			// No link character, backend will append shortened link (14 chars) + backend append (6 chars)
			startCount = shortenedLinkChars + backendAppendChars; // 20 chars
		}
	} else {
		// No link insertion, only backend append
		startCount = backendAppendChars; // 6 chars
	}

	const totalCharacterCount = startCount + characterCount;
	const isOverLimit = totalCharacterCount > maxCharacters;

	return {
		characterCount,
		startCount,
		totalCharacterCount,
		maxCharacters,
		isOverLimit,
		availableForUser: maxCharacters - startCount
	};
};

/**
 * Calculates the number of SMS parts based on character count
 * @param charCount - Total character count
 * @returns Number of SMS parts needed
 */
export const calculateSMSParts = (charCount: number): number => {
	if (charCount <= 70) return 1;
	if (charCount <= 132) return 2;
	if (charCount <= 198) return 3;
	if (charCount <= 264) return 4;
	if (charCount <= 330) return 5;
	return 6; // More than 330 characters
};

/**
 * Validates campaign content step
 * @param content - Campaign content data
 * @returns Validation result
 */
export const validateCampaignContent = (content: {
	text: string;
	insertLink: boolean;
	link?: string;
	scheduleAt?: string;
}) => {
	// Check if text exists
	if (!content.text?.trim()) {
		return { isValid: false, error: 'Please enter text content' };
	}

	// Check if link is provided when link insertion is enabled
	if (content.insertLink && !content.link?.trim()) {
		return { isValid: false, error: 'Please provide a link when link insertion is enabled' };
	}

	// If link insertion is enabled, require link character presence
	if (content.insertLink && !content.text.includes('🔗')) {
		return { isValid: false, error: 'Please insert the link marker (🔗) in your text' };
	}

	// Scheduling is optional. If provided, require at least 20 minutes in the future
	const nowMs = Date.now();
	const minScheduleMs = nowMs + 20 * 60 * 1000;
	if (content.scheduleAt) {
		const scheduledMs = new Date(content.scheduleAt).getTime();
		if (Number.isNaN(scheduledMs) || scheduledMs < minScheduleMs) {
			return { isValid: false, error: 'Please select a schedule at least 20 minutes from now' };
		}
	}

	// Check character limit
	const charCount = calculateTotalCharacterCount(content.text, content.insertLink);

	if (charCount.isOverLimit) {
		return {
			isValid: false,
			error: `Text exceeds maximum length. Available: ${charCount.availableForUser} characters`
		};
	}

	return { isValid: true, error: null };
}; 