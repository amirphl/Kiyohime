export const translations = {
  en: {
    // Header
    header: {
      brand: 'SMS Platform',
      subtitle: 'Consulting and Data-Driven Technology',
      dashboard: 'Dashboard',
      campaigns: 'Campaigns',
      analytics: 'Analytics',
      support: 'Support',
      features: 'Features',
      howItWorks: 'How It Works',
      pricing: 'Pricing',
      signin: 'Sign In',
      signup: 'Sign Up',
      logout: 'Logout',
    },

    // Footer
    footer: {
      description:
        'Empower your business with targeted SMS marketing campaigns. Reach your customers with precision and drive results.',
      quickLinks: 'Quick Links',
      support: 'Support',
      helpCenter: 'Help Center',
      contactUs: 'Contact Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      copyright: '© 2024 SMS Platform. All rights reserved.',
    },

    contact: {
      title: 'Contact Us',
      companyName: 'Rahkarhaye Hadafmand-e Khalagh Company (Private Joint Stock)',
      address: 'Address: Tehran, Molla Sadra Street, North Shirazi Street, Hakim Azam Street, No. 19, Monstrect',
      postalCode: 'Postal Code: 1991647419',
      email: 'info@jazebeh.ir',
      phone: 'Phone: +98 21 8967 7330'
    },

    // --- Admin (new) ---
    adminCommon: {
      backToSardis: 'Back to Sardis',
      sessionExpired: 'your session has expired, redirecting to login page.'
    },
    adminSardis: {
      title: 'Sardis (Admin)',
      subtitle: 'Admin landing page. Use the menu to navigate to sections.',
      cards: {
        lineNumbers: {
          description: 'Create, manage, update and report line numbers',
        },
        campaigns: {
          title: 'Campaigns',
          description: 'Admin campaign management',
        },
        customers: {
          title: 'Customer Management',
          description: 'Customers shares and performance report'
        },
        support: {
          title: 'Tickets & Support',
          description: 'Manage and reply to customer tickets',
        },
      },
    },
    adminCustomers: {
      title: 'Customer Management',
      table: {
        headers: {
          customerName: 'Customer Name',
          representativeName: 'Representative Name',
          agencyName: 'Agency Name',
          toggle: 'Toggle',
          totalSent: 'Total Sent',
          clickRate: 'Click Rate',
          agencyIncome: 'Agency Income',
          systemIncome: 'System Income',
          tax: 'Tax',
          details: 'Details',
          discounts: 'Discounts',
        },
      },
      totals: {
        agencyIncome: 'Sum Agency Income',
        systemIncome: 'Sum System Income',
        tax: 'Sum Tax',
        totalSent: 'Sum Total Sent',
      },
      filters: {
        startDate: 'Start Date',
        endDate: 'End Date',
        apply: 'Apply',
      },
      actions: {
        view: 'View',
        show: 'Show',
      },
      detailsModal: {
        title: 'Customer Details',
        fields: {
          company: 'Company',
          representative: 'Representative',
          email: 'Email',
          mobile: 'Mobile',
          accountType: 'Account Type',
          uuid: 'UUID',
          id: 'ID',
          agencyRefererCode: 'Agency Referrer Code',
          accountTypeId: 'Account Type ID',
          nationalId: 'National ID',
          companyPhone: 'Company Phone',
          companyAddress: 'Company Address',
          postalCode: 'Postal Code',
          shebaNumber: 'Sheba Number',
          referrerAgencyId: 'Referrer Agency ID',
          representativeFirstName: 'Representative First Name',
          representativeLastName: 'Representative Last Name',
          isEmailVerified: 'Email Verified',
          isMobileVerified: 'Mobile Verified',
          isActive: 'Active',
          toggle: 'Toggle',
          createdAt: 'Created At',
          updatedAt: 'Updated At',
          emailVerifiedAt: 'Email Verified At',
          mobileVerifiedAt: 'Mobile Verified At',
          lastLoginAt: 'Last Login At',
        },
        campaignsTable: {
          titleSection: 'Campaigns',
          title: 'Title',
          created: 'Created',
          schedule: 'Schedule',
          status: 'Status',
          sent: 'Sent',
          delivered: 'Delivered',
          clickRate: 'Click Rate',
          noData: 'No data',
          details: 'Details',
        },
        errors: {
          noCustomerId: 'Customer id not available',
          loadFailed: 'Failed to retrieve customer details',
        },
      },
      campaignDetails: {
        title: 'Campaign Details',
        fields: {
          id: 'ID',
          uuid: 'UUID',
          status: 'Status',
          created: 'Created',
          updated: 'Updated',
          title: 'Title',
          segment: 'Segment',
          subsegment: 'Subsegment',
          sex: 'Sex',
          cities: 'Cities',
          adLink: 'Ad Link',
          content: 'Content',
          schedule: 'Schedule',
          lineNumber: 'Line Number',
          budget: 'Budget',
          comment: 'Comment',
          segmentPriceFactor: 'Segment Price Factor',
          lineNumberPriceFactor: 'Line Number Price Factor',
        },
      },
    },
    adminLineNumbers: {
      managementTitle: 'Line Number Management',
      createNew: 'Create New Line Number',
      createTitle: 'Create Line Number',
      fields: {
        nameOptional: 'Name (optional)',
        lineNumber: 'Line Number',
        priceFactor: 'Price Factor',
        priorityOptional: 'Priority (optional)',
        active: 'Active',
      },
      columns: {
        row: '#',
        lineNumber: 'Line Number',
        priority: 'Priority',
        priceFactor: 'Price Factor',
        active: 'Active',
      },
      noItems: 'No items',
      confirmTitle: 'Confirm Create Line Number',
      confirm: {
        name: 'Name',
        lineNumber: 'Line Number',
        priceFactor: 'Price Factor',
        priority: 'Priority',
        active: 'Active',
      },
    },
    adminCampaigns: {
      title: 'Admin Campaigns',
      filters: {
        titleLabel: 'Title',
        titlePlaceholder: 'Search by title',
        statusLabel: 'Status',
        startDateLabel: 'Start Date',
        endDateLabel: 'End Date',
        apply: 'Apply',
        all: 'All',
        statuses: {
          initiated: 'Initiated',
          in_progress: 'In Progress',
          waiting_for_approval: 'Waiting for Approval',
          approved: 'Approved',
          rejected: 'Rejected',
        },
      },
      table: {
        noData: 'No campaigns found',
        headers: {
          row: '#',
          uuid: 'UUID',
          status: 'Status',
          createdAt: 'Created At',
          updatedAt: 'Updated At',
          title: 'Title',
          segment: 'Segment',
          subsegment: 'Subsegment',
          sex: 'Sex',
          city: 'City',
          adLink: 'Ad Link',
          content: 'Content',
          scheduleAt: 'Schedule At',
          lineNumber: 'Line Number',
          budget: 'Budget',
          comment: 'Comment',
          actions: 'Actions',
        },
      },
      modal: {
        approveTitle: 'Approve Campaign',
        rejectTitle: 'Reject Campaign',
        uuid: 'UUID',
        title: 'Title',
        currentStatus: 'Current Status',
        commentLabelOptional: 'Comment (optional)',
        commentLabelRequired: 'Comment (required)',
        maxChars: 'Max 1000 chars',
        cancel: 'Cancel',
        approve: 'Approve',
        reject: 'Reject',
        submitting: 'Submitting…',
      },
      errors: {
        listFailed: 'Failed to list campaigns',
        approveFailed: 'Approve failed',
        rejectFailed: 'Reject failed',
        missingNumericId: 'Campaign numeric id not available',
      },
    },

    // Login Page
    login: {
      title: 'Welcome to SMS Platform',
      subtitle: 'Sign in to access your SMS marketing dashboard',
      emailOrMobile: 'Email or Mobile Number',
      emailOrMobilePlaceholder: '',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      signIn: 'Sign In',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      signUpHere: 'Sign up here',
      success: 'Login successful!',
      validation: {
        allFieldsRequired: 'Please fill in all fields',
      },
      error: {
        invalidCredentials: 'Invalid email/mobile or password',
        customerNotFound: 'Customer not found. Please check your information.',
        accountInactive: 'Account is inactive. Please contact support.',
        accountTypeNotFound: 'Account type not found. Please contact support.',
        incorrectPassword: 'Incorrect password. Please try again.',
        networkError: 'Network error. Please try again.',
      },
      features: {
        title: 'Why Choose SMS Platform?',
        targeted: 'Targeted SMS campaigns',
        segmentation: 'Advanced customer segmentation',
        analytics: 'Real-time analytics and reporting',
        compliance: 'Compliance with regulations',
      },
    },

    // Forgot Password Page
    forgotPassword: {
      title: 'Forgot Password',
      subtitle: 'Enter your email or mobile number to reset your password',
      emailOrMobile: 'Email or Mobile Number',
      emailOrMobilePlaceholder: 'Enter your email or mobile number',
      sendResetLink: 'Send Reset Link',
      backToLogin: 'Back to Login',
      helpText: 'We will send a password reset OTP to your mobile number',
      validation: {
        identifierRequired: 'Please enter your email or mobile number',
      },
      error: {
        requestFailed: 'Failed to send reset link. Please try again.',
        customerNotFound: 'Customer not found. Please check your information.',
        accountInactive: 'Account is inactive. Please contact support.',
        accountTypeNotFound: 'Account type not found. Please contact support.',
        networkError: 'Network error. Please try again.',
      },
      success: {
        title: 'Reset Link Sent',
        subtitle: 'Check your mobile for the OTP',
        message: 'Password reset OTP has been sent to {phone}',
        expiresIn: 'OTP expires in {minutes} minutes',
        tryAgain: 'Try Another Email/Mobile',
        resetPassword: 'Reset Password',
        backToLogin: 'Back to Login',
      },
    },

    // Reset Password Page
    resetPassword: {
      title: 'Reset Password',
      subtitle: 'Enter your new password and OTP code',
      forPhone: 'For phone number: {phone}',
      otpCode: 'OTP Code',
      otpHelp: 'Enter the 6-digit code sent to your mobile',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter your new password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your new password',
      resetPassword: 'Reset Password',
      backToLogin: 'Back to Login',
      requirements: {
        title: 'Password Requirements',
        minLength: 'At least 8 characters',
        letterAndDigit: 'At least 1 letter and 1 digit',
      },
      validation: {
        newPasswordRequired: 'Please enter a new password',
        passwordMin: 'Password must be at least 8 characters',
        passwordUppercase: 'Password must contain at least 1 uppercase letter',
        passwordNumber: 'Password must contain at least 1 number',
        passwordStrength: 'Password must contain at least 1 letter and 1 digit',
        passwordMismatch: 'Passwords do not match',
        otpRequired: 'Please enter the 6-digit OTP code',
      },
      error: {
        resetFailed: 'Failed to reset password. Please try again.',
        customerNotFound: 'Customer not found. Please check your information.',
        accountInactive: 'Account is inactive. Please contact support.',
        accountTypeNotFound: 'Account type not found. Please contact support.',
        noValidOtp: 'No valid OTP found. Please request a new OTP.',
        invalidOtpCode: 'Invalid OTP code. Please try again.',
        invalidOtpType: 'Invalid OTP type. Please try again.',
        otpExpired: 'OTP has expired. Please request a new OTP.',
        networkError: 'Network error. Please try again.',
        noCustomerId: 'Invalid reset link. Please try again.',
      },
      success: {
        title: 'Password Reset Successful',
        subtitle: 'Your password has been updated and you are now logged in',
        message: 'You have been automatically logged in with your new password',
        backToLogin: 'Go to Dashboard',
      },
    },

    // Signup Page
    signup: {
      title: 'Create Your Account',
      subtitle: 'Join SMS Platform and start your SMS marketing journey',
      accountType: 'Account Type',
      selectAccountType: 'Select account type',
      individual: 'Individual',
      independentCompany: 'Independent Company',
      marketingAgency: 'Marketing Agency',

      companyInfo: 'Company Information',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Enter company name',
      nationalId: 'National ID',
      nationalIdPlaceholder: '10-digit national ID',
      companyPhone: 'Company Phone',
      companyPhonePlaceholder: 'Company phone number',
      postalCode: 'Postal Code',
      postalCodePlaceholder: '10-digit postal code',
      companyAddress: 'Company Address',
      companyAddressPlaceholder: 'Enter complete company address',

      personalInfo: 'Personal Information',
      representativeInfo: 'Representative Information',
      firstName: 'First Name',
      firstNamePlaceholder: 'Enter first name',
      lastName: 'Last Name',
      lastNamePlaceholder: 'Enter last name',
      mobileNumber: 'Mobile Number',
      mobilePlaceholder: '09xxxxxxxxx',

      credentials: 'Account Credentials',
      sheba: 'Sheba Number',
      shebaPlaceholder: 'Enter 24 digits (without IR)',
      email: 'Email Address',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm password',

      agencyCode: 'Agency Referral Code (Optional)',
      agencyCodePlaceholder: 'Enter agency code if you have one',
      agencyCodeHelp:
        'If you were referred by an agency, enter their code here',

      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      signInHere: 'Sign in here',
      passwordRequirements: 'Password Requirements',

      // OTP Modal
      verifyMobile: 'Verify Your Mobile Number',
      otpSent: "We've sent a 6-digit verification code to",
      enterVerificationCode: 'Enter Verification Code',
      verifyCode: 'Verify Code',
      attemptsRemaining: 'Attempts remaining:',
      maxAttemptsReached: 'Maximum attempts reached',
      resendIn: 'Resend in',

      // Validation Messages
      validation: {
        required: 'This field is required',
        accountTypeRequired: 'Please select an account type',
        companyNameRequired: 'Company name is required',
        companyNameMax: 'Company name must be 60 characters or less',
        nationalIdRequired: 'National ID is required',
        nationalIdFormat: 'National ID must be 10 to 20 digits',
        companyPhoneRequired: 'Company phone is required',
        companyPhoneMin: 'Phone number must be at least 10 digits',
        companyAddressRequired: 'Company address is required',
        companyAddressMax: 'Address must be 255 characters or less',
        postalCodeRequired: 'Postal code is required',
        postalCodeFormat: 'Postal code must be at least 10 digits',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        mobileRequired: 'Mobile number is required',
        mobileFormat: 'Mobile number must be in format 09xxxxxxxxx',
        emailRequired: 'Email is required',
        emailFormat: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        passwordMin: 'Password must be at least 8 characters',
        passwordUppercase: 'Password must contain at least 1 uppercase letter',
        passwordNumber: 'Password must contain at least 1 number',
        passwordStrength: 'Password must contain at least 1 letter and 1 digit',
        confirmPasswordRequired: 'Please confirm your password',
        passwordMismatch: 'Passwords do not match',
        agencyCodeFormat: 'Agency code must be a valid number',
        invalidOtp: 'Please enter a valid 6-digit OTP',
        maxOtpAttempts: 'Maximum attempts reached. Please try again later.',
        shebaRequiredAgency: 'Sheba number is required for agencies',
        shebaDigits: 'Sheba must contain only English digits',
        shebaLength: 'Sheba must be exactly 24 digits (without IR)',
        shebaNotAllowed: 'Sheba must not be provided for this account type',
      },
      success: 'Account created successfully! Welcome to SMS Platform!',
      otpResent: 'New OTP sent to your mobile number',
      error: {
        signupFailed: 'Failed to create account. Please try again.',
        invalidOtp: 'Invalid OTP. Please try again.',
        resendFailed: 'Failed to resend OTP. Please try again.',
        customerNotFound: 'Customer not found. Please check your information.',
        accountInactive: 'Account is inactive. Please contact support.',
        accountAlreadyVerified: 'Account is already verified. Please sign in.',
        emailExists:
          'Email address already exists. Please use a different email.',
        mobileExists:
          'Mobile number already exists. Please use a different number.',
        nationalIdExists:
          'National ID already exists. Please check your information.',
        accountTypeNotFound:
          'Account type not found. Please select a valid account type.',
        companyFieldsRequired:
          'Company fields are required for business accounts.',
        referrerAgencyNotFound:
          'Referrer agency not found. Please check the agency code.',
        referrerMustBeAgency: 'Referrer must be a marketing agency.',
        referrerAgencyInactive:
          'Referrer agency is inactive. Please contact support.',
        noValidOtp: 'No valid OTP found. Please request a new OTP.',
        invalidOtpType: 'Invalid OTP type. Please try again.',
        otpExpired: 'OTP has expired. Please request a new OTP.',
        networkError: 'Network error. Please try again.',
        noCustomerId: 'No customer ID found. Please try again.',
      },
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      subtitle:
        'Manage your SMS marketing campaigns and track your performance',
      language: 'Language',
      logout: 'Logout',
      support: 'Ticket and Support',
      supportIntro: 'Open a ticket to contact our support team.',
      supportModal: {
        newTicket: 'New Ticket',
        title: 'Create New Support Ticket',
        titleLabel: 'Title (optional)',
        contentLabel: 'Content',
        fileLabel: 'Attachment (optional)',
        titlePlaceholder: 'Enter a short title (<= 80 chars)',
        contentPlaceholder: 'Describe your request (<= 1000 chars)',
        fields: {
          ticketTitle: 'Title (optional, max 80)',
          description: 'Description',
          attachment: 'Attachment (optional)',
          attachmentHelp: 'jpg, png, pdf, docx, xlsx, zip — up to 10 MB',
        },
        placeholders: {
          ticketTitle: 'Enter a brief title (max 80 characters)',
          description: 'Describe your issue or request (max 1000 characters)',
        },
        validation: {
          titleMax: 'Title must be at most 80 characters',
          descriptionRequired: 'Description is required',
          descriptionMax: 'Description must be at most 1000 characters',
          invalidType: 'Invalid file type. Allowed: jpg, png, pdf, docx, xlsx, zip',
          maxSize: 'File size must be less than 10 MB',
        },
        replyTitle: 'Reply to Ticket',
        submit: 'Submit Ticket',
        success: 'Your ticket has been created successfully',
        error: 'Failed to create ticket. Please try again.',
      },

      // Filters
      filterTitlePlaceholder: 'Filter by title...'
,
      // Sort controls
      sortBy: 'Sort by',
      sortNewest: 'Newest',
      sortOldest: 'Oldest',

      // Sidebar Navigation
      dashboard: 'Dashboard',
      targetedSend: 'targeted send',
      reports: 'Reports',
      campaigns: 'Campaign and Customer',
      wallet: 'Wallet and Charge',
      customerManagement: 'Customer Management',
      discountManagement: 'Discount Management',
      customerDiscountManagement: 'Customer & Discount Management',

      // Stats
      stats: {
        totalCampaigns: 'Total Campaigns',
        totalCustomers: 'Total Customers',
        walletBalance: 'Wallet Balance',
        activeTickets: 'Active Tickets',
      },

      // Content
      recentActivity: 'Recent Activity',
      noActivity: 'No recent activity',
      reportsTable: {
        row: '#',
        title: 'Title',
        text: 'Text',
        lineNumber: 'Line Number',
        segment: 'Segment',
        sent: 'Sent',
        status: 'Status',
        total: 'Total',
        createdAt: 'Created At',
        scheduleAt: 'Schedule At',
        details: 'Details',
        subsegments: 'Subsegments',
        sex: 'Sex',
        cities: 'Cities',
        adlink: 'Ad Link',
        updatedAt: 'Updated At',
      },
      reportsStatus: {
        initiated: 'Initiated',
        'in-progress': 'In Progress',
        'waiting-for-approval': 'Waiting for Approval',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      fixAndRestart: 'Fix and restart the campaign?',
      supportHistory: 'Tickets History',
    },

    // Campaign Creation
    campaign: {
      title: 'Create SMS Campaign',
      subtitle: 'Create a targeted SMS campaign in 4 simple steps',
      
      // Steps
      step1: 'Segment',
      step2: 'Content',
      step3: 'Budget',
      step4: 'Payment',
      
      // Steps structure for StepHeader components
      steps: {
        segment: {
          title: 'Define Your Target Segment',
          subtitle: 'Select the criteria for your target audience',
        },
        content: {
          title: 'Design Your Message',
          subtitle: 'Create compelling content for your SMS campaign',
        },
        budget: {
          title: 'Set Your Budget',
          subtitle: 'Define the financial parameters for your campaign',
        },
        payment: {
          title: 'Payment & Confirmation',
          subtitle: 'Review and confirm your campaign details',
        },
      },
      
      // Navigation
      nextPage: 'Next Page',
      previousPage: 'Previous Page',
      finish: 'Finish',
      
      // Confirmation Modal
      confirmTitle: 'Are you sure?',
      confirmMessage: 'Do you want to finish creating this campaign?',
      yes: 'Yes',
      no: 'No',
      
      // Loading
      creating: 'Creating campaign...',
      pleaseWait: 'Please wait while we create your campaign.',
      
      // Success
      success: 'Campaign created successfully!',
      redirecting: 'Redirecting to dashboard...',
      
      // Errors
      error: 'Failed to create campaign',
      tryAgain: 'Please try again.',
      
      // Step 1: Segment
      segment: {
        title: 'Define Your Target Segment',
        subtitle: 'Select the criteria for your target audience',
        
        // Campaign Title
        campaignTitle: 'Campaign Title',
        campaignTitlePlaceholder: 'Enter campaign title (max 255 characters)',
        campaignTitleValidation: 'Campaign title must be at most 255 characters',
        
        // Segment Selection
        segment: 'Segment',
        segmentPlaceholder: 'Choose a segment',
        selectSegment: 'Select Segment',
        
        // Subsegments
        subsegments: 'Subsegments',
        subsegmentsFor: 'Subsegments for {segment}',
        subsegmentsHelp: 'Select at least one subsegment (multiple selection allowed)',
        subsegmentsValidation: 'Please select at least one subsegment',
        
        // Sex Selection
        sex: 'Sex',
        sexPlaceholder: 'Choose sex preference',
        selectSex: 'Select Sex',
        
        // City Selection
        cities: 'Cities',
        citiesHelp: 'Select at least one city (multiple selection allowed)',
        citiesPlaceholder: 'Select a city',
        citiesValidation: 'Please select at least one city',
        
        // Summary Section
        campaignSummary: 'Campaign Summary',
        campaignTitleLabel: 'Campaign Title:',
        segmentLabel: 'Segment:',
        subsegmentsLabel: 'Subsegments:',
        sexLabel: 'Sex:',
        citiesLabel: 'Cities:',
        notSet: 'Not set',
        
        // Campaign Capacity Section
        campaignCapacity: 'Campaign Capacity',
        capacityDescription: 'Number of people who will receive your SMS based on selected filters',
        calculatingCapacity: 'Calculating capacity...',
        capacityResult: '{count} people will receive your SMS',
        capacityError: 'Unable to calculate capacity. Please check your selections.',
        capacityHelp: 'Capacity is calculated automatically as you adjust your campaign filters.',
                campaignCapacityHelp: 'Capacity is calculated automatically as you adjust your campaign filters.',
        capacityTooLow: 'Capacity too low (< 500). Remove some filters to increase campaign capacity.',
         estimatedCapacity: 'Estimated Capacity',
        calculating: 'Calculating...',
        users: 'users',
        
        // Legacy fields (keeping for backward compatibility)
        customerType: 'Customer Type',
        customerTypePlaceholder: 'Select customer type',
        ageRange: 'Age Range',
        ageRangePlaceholder: 'Select age range',
        location: 'Location',
        locationPlaceholder: 'Enter city or province',
        interests: 'Interests',
        interestsPlaceholder: 'Select interests',
        customFilters: 'Custom Filters',
        addFilter: 'Add Filter',
        removeFilter: 'Remove',
        filterField: 'Field',
        filterOperator: 'Operator',
        filterValue: 'Value',

        searchPlaceholder: 'Search ...',
      },
      
      // Step 2: Content
      content: {
        title: 'Design Your Message',
        subtitle: 'Create compelling content for your SMS campaign',
        
        // Legacy fields (keeping for backward compatibility)
        messageText: 'Message Text',
        messageTextPlaceholder: 'Enter your SMS message here...',
        characterCount: 'Characters: {count}/160',
        senderName: 'Sender Name',
        senderNamePlaceholder: 'Enter sender name (optional)',
        preview: 'Message Preview',
        previewPlaceholder: 'Your message will appear here...',
        
        // Insert Link Section
        insertLink: 'Insert Link',
        linkInsertionEnabled: 'Link insertion is enabled',
        linkInsertionDisabled: 'Link insertion is disabled',
        on: 'ON',
        off: 'OFF',
        
        // Link Input Section
        link: 'Link',
        campaignLink: 'Campaign Link',
        linkPlaceholder: 'Enter link URL (max 10000 characters)',
        linkValidation: 'Link must be at most 10000 characters',
        linkInvalidUrl: 'Please enter a valid URL (must start with http:// or https://)',
        insertLinkCharacter: 'Add link here',
        linkCharacterInserted: 'Link position marked',
        linkCharacterInsertedMessage: 'Link will be inserted at the marked position (🔗)',
        characters: 'characters',
        
        // Text Content Section
        text: 'Text',
        campaignText: 'Campaign Text',
        textPlaceholder: 'Enter your campaign message text',
        
        // Character Counter Section
        charactersLabel: 'Characters: {count} (user input)',
        totalLabel: 'Total: {count} / {max}',
        partsLabel: 'Parts: {count}',
        partsCount: '{total}/{parts}',
        
        // Parts Explanation
        partsBreakdown: 'Parts breakdown:',
        partsExplanation: '≤70 chars = 1 part, ≤132 = 2 parts, ≤198 = 3 parts, ≤264 = 4 parts, ≤330 = 5 parts',
        withLinkExplanation: 'With link: starts at 20 chars (6 cancellation + 14 shortened link)',
        withoutLinkExplanation: 'Without link: starts at 6 chars (cancellation append)',
        
        // Warning Messages
        textExceedsLimit: '⚠️ Text exceeds maximum length. Please shorten your message.',
        
        // Schedule Section
        scheduleAt: 'Schedule At (Optional)',
        enableSchedule: 'Enable Schedule',
        disableSchedule: 'Disable Schedule',
        campaignScheduled: 'Campaign will be scheduled',
        campaignImmediate: 'Campaign will be sent immediately',
        scheduleDateTime: 'Schedule Date & Time (Tehran Time)',
        schedulePlaceholder: 'Select date and time',
        scheduledFor: 'Scheduled for: {datetime}',
        scheduleTooSoon: 'Please pick a time at least 20 minutes from now',
        
        // Content Summary Section
        contentSummary: 'Content Summary',
        linkInsertionLabel: 'Link Insertion:',
        linkLabel: 'Link:',
        textLabel: 'Text:',
        scheduleLabel: 'Schedule:',
        enabled: 'Enabled',
        disabled: 'Disabled',
        immediate: 'Immediate',
        notSet: 'Not set',
      },
      
      // Step 3: Budget
      budget: {
        title: 'Set Your Budget',
        subtitle: 'Define the financial parameters for your campaign',
        
        // Line Number Selection
        lineNumber: 'Line Number',
        selectLineNumber: 'Select Line Number',
        lineNumberPlaceholder: 'Choose a line number for your campaign',
        lineNumberHelp: 'Select the phone line that will be used to send SMS messages for this campaign.',
        selectedLine: 'Selected Line',
        
        // Total Budget
        totalBudget: 'Total Budget',
        campaignBudget: 'Campaign Budget',
        budgetPlaceholder: 'Enter budget amount in Toman',
        budgetValidation: 'Budget must be between 1 and 100,000,000,000 Toman',
        budget: 'Budget',
        budgetHelp: 'Set your total campaign budget. The system will calculate how many messages can be sent with this budget.',
        
        // Estimated Messages
        estimatedMessages: 'Number of Messages That Can Be Sent',
        calculatingMessages: 'Calculating messages...',
        messages: 'messages',
        basedOnBudget: 'Based on your budget of {budget}',
        lastUpdated: 'Last updated: {time}',
        calculating: 'Calculating...',
        enterBudgetToSee: 'Enter a budget to see estimated messages',
        estimatedMessagesHelp: 'This field is automatically calculated by the backend based on your budget and current message costs.',
        note: 'Note:',
        notStored: 'This value is not stored in your campaign data and will be recalculated when needed.',
        
        // Budget Summary
        budgetSummary: 'Budget Summary',
        lineNumberLabel: 'Line Number:',
        totalBudgetLabel: 'Total Budget:',
        estimatedMessagesLabel: 'Estimated Messages:',
        messageCountHelp: 'Number of messages that can be sent with your budget',
        calculateMessageCount: 'Calculate Message Count',
        calculatingMessageCount: 'Calculating message count...',
        messageCountResult: '{count} messages can be sent',
        messageCountError: 'Unable to calculate message count. Please check your selections.',
        notSelected: 'Not Selected',
        notSet: 'Not Set',
        estimatedReach: 'Estimated Reach',
        estimatedReachMessage: 'This shows how many people your campaign can reach based on your budget and targeting criteria.',
        budgetSummaryHelp: 'Review your budget allocation and estimated campaign reach before proceeding to payment.',
        
        // Line number options
        line1: 'Line 1 - Main Campaign Line',
        line2: 'Line 2 - Secondary Line',
        line3: 'Line 3 - Support Line',
        line4: 'Line 4 - Marketing Line',
        line5: 'Line 5 - Customer Service',
        
        // Wallet Balance Section
        walletBalance: 'Wallet Balance',
        checkingBalance: 'Checking wallet balance...',
        availableBalance: 'Available Balance',
        campaignCost: 'Campaign Cost',
        toman: 'Toman',
        sufficientBalance: 'Sufficient balance for campaign',
        insufficientBalance: 'Insufficient balance for campaign',
        insufficientBalanceMessage: 'You need to add more funds to your wallet to proceed with this campaign.',
        goToWallet: 'Go to Wallet & Charge',
        balanceError: 'Failed to check wallet balance',
        retryBalance: 'Retry',
        enterBudgetToCheck: 'Enter a budget to check wallet balance',
        balanceHelp: 'Your wallet balance is checked against the campaign budget to ensure you have sufficient funds.',
      },
      
      // Step 4: Payment
      payment: {
        title: 'Payment & Confirmation',
        subtitle: 'Review and confirm your campaign details',
        
        // Campaign Summary Section
        campaignSummary: 'Campaign Summary',
        campaignTitle: 'Campaign Title:',
        segment: 'Segment:',
        subsegments: 'Subsegments:',
        subsegmentsSelected: '{count} selected',
        sex: 'Sex:',
        cities: 'Cities:',
        citiesSelected: '{count} selected',
        messageLength: 'Message Length:',
        characters: 'characters',
        linkInsertion: 'Link Insertion:',
        enabled: 'Enabled',
        disabled: 'Disabled',
        budget: 'Budget:',
        lineNumber: 'Line Number:',
        notSet: 'Not set',
        
        // Cost Breakdown Section
        costBreakdown: 'Cost Breakdown',
        calculatingCosts: 'Calculating costs...',
        total: 'Total:',
        lastCalculated: 'Last calculated: {time}',
        calculatingCostsMessage: 'Calculating costs...',
        completeDetailsMessage: 'Complete campaign details to see cost breakdown',
        costsHelp: 'Costs are automatically calculated by the system based on your campaign settings.',
        note: 'Note:',
        costsNotStored: 'Cost values are not stored in your campaign data and will be recalculated when needed.',
        estimatedMessages: 'Estimated Messages',
        messages: 'messages',
        costCalculationError: 'Failed to calculate costs',
        retryCalculation: 'Retry Calculation',
        
        // Payment Method Section
        paymentMethod: 'Payment Method',
        creditCard: 'Credit Card',
        creditCardDesc: 'Pay securely with your credit or debit card',
        wallet: 'Wallet',
        walletDesc: 'Use your wallet balance for payment',
        bankTransfer: 'Bank Transfer',
        bankTransferDesc: 'Transfer directly from your bank account',
        
        // Terms and Conditions Section
        termsAndConditions: 'Terms and Conditions',
        acceptTerms: 'I agree to the terms and conditions',
        termsHelp: 'By accepting these terms, you agree to our campaign policies and payment terms. The total amount shown above will be charged upon campaign completion.',
        
        // Final Summary Section
        finalSummary: 'Final Summary',
        readyForPayment: 'Your campaign is ready for payment',
        totalLabel: 'Total:',
        clickFinish: 'Click "Finish" to complete your campaign',
        
        // Wallet Balance Section
        walletBalance: 'Wallet Balance',
        checkingBalance: 'Checking wallet balance...',
        availableBalance: 'Available Balance',
        campaignCost: 'Campaign Cost',
        toman: 'Toman',
        sufficientBalance: 'Sufficient balance for campaign',
        insufficientBalance: 'Insufficient balance for campaign',
        insufficientBalanceMessage: 'You need to add more funds to your wallet to proceed with this campaign.',
        goToWallet: 'Go to Wallet & Charge',
        balanceError: 'Failed to check wallet balance',
        balanceErrorHelp: 'Please try again later or contact support.',
        balanceNotAvailable: 'Wallet balance not available',
        balanceHelp: 'Your wallet balance is checked against the campaign cost.',
      },
    },

    // Home Page
    home: {
      hero: {
        badge: 'Consulting and Data-Driven Technology',
        title: 'Transform Your Business with Targeted SMS Marketing',
        subtitle:
          'Reach your customers with precision, drive engagement, and boost conversions with our advanced Data-Driven Technology designed for modern businesses.',
        cta: 'Get Started Free',
        signin: 'Sign In',
      },
      stats: {
        customers: 'Happy Customers',
        messages: 'Messages Sent',
        delivery: 'Delivery Rate',
        support: 'Customer Support',
      },
      features: {
        title: 'Why Choose Our Platform?',
        subtitle:
          'Powerful features designed to help you succeed in SMS marketing',
        targeted: {
          title: 'Targeted Campaigns',
          description:
            'Create highly targeted SMS campaigns based on customer behavior, demographics, and preferences.',
        },
        segmentation: {
          title: 'Smart Segmentation',
          description:
            'Segment your audience intelligently and send personalized messages that resonate.',
        },
        analytics: {
          title: 'Real-time Analytics',
          description:
            'Track campaign performance with detailed analytics and actionable insights.',
        },
        compliance: {
          title: 'Regulatory Compliance',
          description:
            'Built-in compliance features ensure your campaigns meet all regulatory requirements.',
        },
      },
      howItWorks: {
        title: 'How It Works',
        subtitle: 'Get started with SMS marketing in three simple steps',
        step1: {
          title: 'Create Your Account',
          description:
            'Sign up and set up your business profile in minutes with our streamlined onboarding process.',
        },
        step2: {
          title: 'Design Your Campaign',
          description:
            'Use our intuitive tools to create compelling SMS campaigns with advanced targeting options.',
        },
        step3: {
          title: 'Send & Track Results',
          description:
            'Launch your campaigns and monitor real-time performance with comprehensive analytics.',
        },
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle:
          'Join thousands of businesses already using our platform to grow their customer base.',
        button: 'Start Your Free Trial',
      },
    },

    // Error Boundary
    error: {
      title: 'Something went wrong',
      message: 'Sorry, something went wrong. Please refresh the page.',
      refresh: 'Refresh Page',
    },

    // Wallet Page
    wallet: {
      title: 'Wallet & Charge',
      comingSoon: 'Coming Soon',
      comingSoonMessage: 'The wallet and charge functionality is under development. You will be able to manage your balance and add funds here soon.',
      backToDashboard: 'Back to Dashboard',
      currency: 'Toman',
      currentBalance: 'Current Balance',
      free: 'Free',
      locked: 'Locked',
      reserved: 'Reserved',
      credit: 'Credit',
      total: 'Total',
      lastUpdated: 'Last Updated',
      chargeTitle: 'Charge Wallet',
      amountLabel: 'Amount (Toman)',
      amountPlaceholder: 'Enter amount',
      errorInvalidNumber: 'Please enter a valid number',
      errorMinAmount: 'Amount must be at least 100,000 Toman',
      errorMultipleOf: 'Amount must be a multiple of 10,000 Toman',
      pay: 'Pay',
      historyTitle: 'Payment & Charge History',
      table: {
        row: 'Row',
        datetime: 'Datetime',
        type: 'Type',
        status: 'Status',
        freeIncrease: 'Free Increase',
        creditIncrease: 'Credit Increase',
        description: 'Description',
        noTransactions: 'No transactions',
        createdAt: 'Created At',
      },
      operationTypes: {
        'Wallet Recharge': 'Wallet Recharge',
        'Wallet Withdrawal': 'Wallet Withdrawal',
        'Campaign Launch': 'Campaign Launch',
        'Fund Freeze': 'Fund Freeze',
        'Fund Unfreeze': 'Fund Unfreeze',
        'Fund Lock': 'Fund Lock',
        'Fund Unlock': 'Fund Unlock',
        'Refund': 'Refund',
        'Service Fee': 'Service Fee',
        'Balance Adjustment': 'Balance Adjustment',
      },
      statuses: {
        Pending: 'Pending',
        Completed: 'Completed',
        Failed: 'Failed',
        Cancelled: 'Cancelled',
        Reversed: 'Reversed',
      },
      modalTitle: 'Payment Confirmation',
      modalChargeAmount: 'Charge Amount:',
      modalTax: 'Tax (10%):',
      modalTotal: 'Total to Pay:',
    },

    // Common
    common: {
      loading: 'Loading...',
      required: '*',
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      previous: 'Previous',
      next: 'Next',
      submit: 'Submit',
      resend: 'Resend',
      seconds: 's',
      finish: 'Finish',
      continue: 'Continue',
      yes: 'Yes',
      no: 'No',
      comingSoon: 'Coming soon',
      details: 'Details',
      reply: 'Reply',
    },

    // Agency Customer Report
    agencyReport: {
      startDate: 'Start Date',
      endDate: 'End Date',
      selectStart: 'Select start date',
      selectEnd: 'Select end date',
      firstName: 'First Name',
      lastName: 'Last Name',
      companyName: 'Company',
      totalSent: 'Total Sent',
      totalShare: 'Total Share (with tax)',
      totalSentAll: 'Sum Total Sent',
      totalShareAll: 'Sum Total Share',
      invalidRange: 'End date must be greater than start date',
      name: 'Name filter',
      namePlaceholder: 'Filter by name...',
      applyFilters: 'Apply Filters',
      tableTitle: 'Customers Report',
      discountsTitle: 'Active Discounts',
      discountCustomer: 'Customer',
      discountRate: 'Rate (%)',
      discountCreatedAt: 'Created At',
      discountCreateAction: 'Create New',
      discountHistoryAction: 'History',
      discountHistoryTitle: 'Discount History',
      discountCreateTitle: 'Create New Discount',
      discountName: 'Discount Name',
      discountRateLabel: 'Discount Rate (0 - 0.5)',
      discountCreate: 'Create',
      discountCancel: 'Cancel',
      discountNameRequired: 'Name is required',
      discountRateInvalid: 'Rate must be greater than 0 and less than 0.5',
      discountExpiresAt: 'Expires At',
      discountGlobalCreate: 'Create Discount',
      discountSelectCustomer: 'Select Customer',
    },

    // Support (Customer)
    supportPage: {
      title: 'Ticket & Support',
      intro: 'Open a ticket to contact our support team.',
      create: 'Create Ticket',
      history: 'Tickets History',
      modal: {
        title: 'Create Support Ticket',
        submit: 'Submit',
        titleLabel: 'Title (optional)',
        titlePlaceholder: 'Enter a short title (<= 80 chars)',
        contentLabel: 'Content',
        contentPlaceholder: 'Describe your request (<= 1000 chars)',
        fileLabel: 'Attachment (optional)',
        success: 'Ticket created successfully'
      },
      table: {
        row: 'Row',
        title: 'Title',
        content: 'Content',
        createdAt: 'Created At',
        details: 'Details',
        noRecords: 'No records'
      }
    },

    // Admin Tickets
    adminTickets: {
      title: 'Admin Tickets & Support',
    },

    // Pricing
    pricing: {
      title: 'Pricing',
      subtitle: 'Simple, transparent pricing that grows with you',
      intro: {
        title: 'How Pricing Works',
        description: 'To use Jadhbe\'s features, you need to top up your account. By charging your digital wallet, you can access all Jadhbe services including landing page design and optimization, marketing lead tracking, customer journey analysis, and marketing automation. The cost of each service is calculated based on usage volume (number of active campaigns, number of processed segments, and analytical features), and the legal tax (10%) is transparently deducted from your charge. By purchasing more credit, you will also benefit from discounts on Basic, Pro, and Enterprise plans.',
        payAsYouGo: {
          title: 'Pay As You Go',
          description: 'Charged based on actual usage'
        },
        transparent: {
          title: 'Transparent Fees',
          description: '10% tax included in all transactions'
        },
        volume: {
          title: 'Volume Discounts',
          description: 'Save more with higher credit purchases'
        }
      },
      plans: {
        title: 'Choose Your Plan',
        popular: 'Popular',
        getStarted: 'Get Started',
        basic: {
          name: 'Basic',
          description: 'Perfect for small businesses getting started',
          discount: '5% discount',
          features: {
            campaigns: 'Up to 10 active campaigns',
            segments: 'Basic segmentation',
            analytics: 'Standard analytics',
            support: 'Email support'
          }
        },
        pro: {
          name: 'Pro',
          description: 'For growing businesses with advanced needs',
          discount: '10% discount',
          features: {
            campaigns: 'Up to 50 active campaigns',
            segments: 'Advanced segmentation',
            analytics: 'Advanced analytics & tracking',
            automation: 'Marketing automation',
            support: 'Priority support'
          }
        },
        enterprise: {
          name: 'Enterprise',
          description: 'Custom solutions for large organizations',
          discount: '15% discount',
          features: {
            campaigns: 'Unlimited campaigns',
            segments: 'Custom segmentation',
            analytics: 'Enterprise analytics',
            automation: 'Full automation suite',
            support: 'Dedicated account manager',
            custom: 'Custom integrations'
          }
        }
      },
      cta: {
        title: 'Ready to get started?',
        description: 'Create your account today and start your first campaign',
        signup: 'Sign Up Now',
        contact: 'Contact Sales'
      }
    },
  },

  fa: {
    // Header
    header: {
      brand: 'پلتفرم هوشمند و داده‌محور',
      subtitle: 'پلتفرم بازاریابی هوشمند و داده‌محور',
      dashboard: 'داشبورد',
      campaigns: 'کمپین‌ها',
      analytics: 'تحلیلات',
      support: 'پشتیبانی',
      features: 'ویژگی‌ها',
      howItWorks: 'چگونه جاذبه به شما کمک می‌کند',
      pricing: 'قیمت‌گذاری',
      signin: 'ورود',
      signup: 'ثبت نام',
      logout: 'خروج',
    },

    // Footer
    footer: {
      description: 'بازاریابی خود را با جاذبه علمی و شخصی‌سازی‌شده کنید. از ابزارهای تحلیل داده و اتومیشن ما برای بهینه‌سازی تجربهٔ مشتری و افزایش نرخ تبدیل بهره ببرید',
      quickLinks: 'لینک‌های سریع',
      support: 'پشتیبانی',
      helpCenter: 'مرکز راهنمایی',
      contactUs: 'تماس با ما',
      privacyPolicy: 'حریم خصوصی',
      termsOfService: 'شرایط خدمات',
      copyright: 'صاحب امتیاز تمامی حقوق وب‌سایت، شرکت راه‌کارهای هدفمند خلاق می‌باشد',
    },

    contact: {
      title: 'تماس با ما',
      companyName: 'شرکت راه کارهای هدفمند خلاق (سهامی خاص)',
      address: 'نشانی: استان : تهران - شهرستان : تهران - بخش : مرکزی - شهر : تهران - محله : آرارات - بزرگراه کردستان - خیابان حکیم اعظم - پلاک : -19.0 - طبقه : 3 - واحد : 6',
      postalCode: 'کدپستی: ۱۹۹۱۶۴۷۴۱۹',
      email: 'info@jazebeh.ir',
      phone: 'تلفن ثابت: ۰۲۱۸۹۶۷۷۳۳۰ - ۰۲۱۸۹۶۷۰۰۰۰'
    },

    // --- Admin (new) ---
    adminCommon: {
      backToSardis: 'بازگشت به ساردیس',
      sessionExpired: 'نشست شما منقضی شده است، در حال انتقال به صفحه ورود.'
    },
    adminSardis: {
      title: 'ساردیس (مدیریت ادمین)',
      subtitle: 'صفحه اصلی مدیریت ادمین. از منو برای دسترسی به بخش‌ها استفاده کنید.',
      cards: {
        lineNumbers: {
          description: 'ایجاد، مدیریت، بروزرسانی و گزارش شماره‌های خط',
        },
        campaigns: {
          title: 'کمپین‌ها',
          description: 'مدیریت کمپین‌های ادمین',
        },
        customers: {
          title: 'مدیریت مشتریان',
          description: 'گزارش سهم‌ها و عملکرد مشتریان'
        },
        support: {
          title: 'تیکت‌ها و پشتیبانی',
          description: 'مدیریت و پاسخ به تیکت‌های مشتریان'
        },
      },
    },
    adminCustomers: {
      title: 'مدیریت مشتریان',
      table: {
        headers: {
          customerName: 'نام مشتری',
          representativeName: 'نام نماینده',
          agencyName: 'نام آژانس',
          totalSent: 'تعداد ارسال',
          toggle: 'تغییر وضعیت',
          clickRate: 'نرخ کلیک',
          agencyIncome: 'درآمد آژانس',
          systemIncome: 'درآمد ما (سیستم)',
          tax: 'مالیات',
          details: 'جزئیات',
          discounts: 'تخفیف‌ها',
        },
      },
      totals: {
        agencyIncome: 'مجموع درآمد آژانس',
        systemIncome: 'مجموع درآمد ما (سیستم)',
        tax: 'مجموع مالیات',
        totalSent: 'مجموع کل ارسال',
      },
      filters: {
        startDate: 'تاریخ شروع',
        endDate: 'تاریخ پایان',
        apply: 'اعمال',
      },
      actions: {
        view: 'مشاهده',
        show: 'نمایش',
      },
      detailsModal: {
        title: 'جزئیات مشتری',
        fields: {
          company: 'نام شرکت',
          representative: 'نماینده',
          email: 'ایمیل',
          mobile: 'موبایل',
          accountType: 'نوع حساب',
          uuid: 'UUID',
          id: 'شناسه',
          agencyRefererCode: 'کد معرف آژانس',
          accountTypeId: 'شناسه نوع حساب',
          nationalId: 'شناسه ملی',
          companyPhone: 'تلفن شرکت',
          companyAddress: 'آدرس شرکت',
          postalCode: 'کدپستی',
          shebaNumber: 'شماره شبا',
          referrerAgencyId: 'شناسه آژانس معرف',
          representativeFirstName: 'نام نماینده',
          representativeLastName: 'نام خانوادگی نماینده',
          isEmailVerified: 'ایمیل تأیید شده',
          isMobileVerified: 'موبایل تأیید شده',
          isActive: 'فعال',
          toggle: 'تغییر وضعیت',
          createdAt: 'ایجاد شده در',
          updatedAt: 'به‌روزرسانی در',
          emailVerifiedAt: 'زمان تأیید ایمیل',
          mobileVerifiedAt: 'زمان تأیید موبایل',
          lastLoginAt: 'آخرین ورود',
        },
        campaignsTable: {
          titleSection: 'کمپین‌ها',
          title: 'عنوان',
          created: 'ایجاد',
          schedule: 'زمان‌بندی',
          status: 'وضعیت',
          sent: 'ارسال',
          delivered: 'تحویل',
          clickRate: 'نرخ کلیک',
          noData: 'داده‌ای موجود نیست',
          details: 'جزئیات',
        },
        errors: {
          noCustomerId: 'شناسه مشتری در دسترس نیست',
          loadFailed: 'دریافت جزئیات مشتری ناموفق بود',
        },
      },
      campaignDetails: {
        title: 'جزئیات کمپین',
        fields: {
          id: 'شناسه',
          uuid: 'UUID',
          status: 'وضعیت',
          created: 'ایجاد شده',
          updated: 'به‌روزرسانی',
          title: 'عنوان',
          segment: 'بخش',
          subsegment: 'زیربخش',
          sex: 'جنسیت',
          cities: 'شهرها',
          adLink: 'لینک تبلیغ',
          content: 'محتوا',
          schedule: 'زمان‌بندی',
          lineNumber: 'شماره خط',
          budget: 'بودجه',
          comment: 'توضیح',
          segmentPriceFactor: 'ضریب قیمت بخش',
          lineNumberPriceFactor: 'ضریب قیمت شماره خط',
        },
      },
    },
    adminLineNumbers: {
      managementTitle: 'مدیریت شماره خط',
      createNew: 'ایجاد شماره خط جدید',
      createTitle: 'ایجاد شماره خط',
      fields: {
        nameOptional: 'نام (اختیاری)',
        lineNumber: 'شماره خط',
        priceFactor: 'ضریب قیمت',
        priorityOptional: 'اولویت (اختیاری)',
        active: 'فعال',
      },
      columns: {
        row: '#',
        lineNumber: 'شماره خط',
        priority: 'اولویت',
        priceFactor: 'ضریب قیمت',
        active: 'فعال',
      },
      noItems: 'آیتمی وجود ندارد',
      confirmTitle: 'تأیید ایجاد شماره خط',
      confirm: {
        name: 'نام',
        lineNumber: 'شماره خط',
        priceFactor: 'ضریب قیمت',
        priority: 'اولویت',
        active: 'فعال',
      },
    },
    adminCampaigns: {
      title: 'کمپین‌های ادمین',
      filters: {
        titleLabel: 'عنوان',
        titlePlaceholder: 'جستجو بر اساس عنوان',
        statusLabel: 'وضعیت',
        startDateLabel: 'تاریخ شروع',
        endDateLabel: 'تاریخ پایان',
        apply: 'اعمال',
        all: 'همه',
        statuses: {
          initiated: 'آغاز شده',
          in_progress: 'در حال انجام',
          waiting_for_approval: 'در انتظار تأیید',
          approved: 'تأیید شده',
          rejected: 'رد شده',
        },
      },
      table: {
        noData: 'کمپینی یافت نشد',
        headers: {
          row: '#',
          uuid: 'UUID',
          status: 'وضعیت',
          createdAt: 'ایجاد شده در',
          updatedAt: 'به‌روزرسانی در',
          title: 'عنوان',
          segment: 'بخش',
          subsegment: 'زیر‌بخش',
          sex: 'جنسیت',
          city: 'شهر',
          adLink: 'لینک تبلیغ',
          content: 'محتوا',
          scheduleAt: 'زمان‌بندی',
          lineNumber: 'شماره خط',
          budget: 'بودجه',
          comment: 'توضیح',
          actions: 'اقدامات',
        },
      },
      modal: {
        approveTitle: 'تأیید کمپین',
        rejectTitle: 'رد کمپین',
        uuid: 'UUID',
        title: 'عنوان',
        currentStatus: 'وضعیت فعلی',
        commentLabelOptional: 'توضیح (اختیاری)',
        commentLabelRequired: 'توضیح (الزامی)',
        maxChars: 'حداکثر ۱۰۰۰ کاراکتر',
        cancel: 'انصراف',
        approve: 'تأیید',
        reject: 'رد',
        submitting: 'در حال ارسال…',
      },
      errors: {
        listFailed: 'دریافت فهرست کمپین‌ها ناموفق بود',
        approveFailed: 'تأیید ناموفق بود',
        rejectFailed: 'رد ناموفق بود',
        missingNumericId: 'شناسه عددی کمپین در دسترس نیست',
      },
    },

    // Login Page
    login: {
      title: 'به پلتفرم هوشمند و داده‌محور خوش آمدید',
      subtitle: 'برای دسترسی به داشبورد بازاریابی هوشمند و داده‌محور وارد شوید',
      emailOrMobile: 'ایمیل یا شماره موبایل',
      emailOrMobilePlaceholder: '',
      password: 'رمز عبور',
      passwordPlaceholder: '',
      signIn: 'ورود',
      forgotPassword: 'رمز عبور را فراموش کرده‌اید؟',
      noAccount: 'حساب کاربری ندارید؟',
      signUpHere: 'اینجا ثبت نام کنید',
      success: 'ورود موفقیت‌آمیز بود!',
      validation: {
        allFieldsRequired: 'لطفاً تمام فیلدها را پر کنید',
      },
      error: {
        invalidCredentials: 'ایمیل/موبایل یا رمز عبور نامعتبر',
        customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
        accountInactive:
          'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        accountTypeNotFound:
          'نوع حساب کاربری یافت نشد. لطفاً با پشتیبانی تماس بگیرید.',
        incorrectPassword: 'رمز عبور نادرست است. لطفاً دوباره تلاش کنید.',
        networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
      },
      features: {
        title: 'چرا پلتفرم هوشمند و داده‌محور را انتخاب کنیم؟',
        targeted: 'کمپین‌های هوشمند و داده‌محور هدفمند',
        segmentation: 'بخش‌بندی پیشرفته مشتریان',
        analytics: 'تحلیلات و گزارش‌گیری بلادرنگ',
        compliance: 'سازگاری با قوانین',
      },
    },

    // Forgot Password Page
    forgotPassword: {
      title: 'فراموشی رمز عبور',
      subtitle: 'ایمیل یا شماره موبایل خود را برای بازنشانی رمز عبور وارد کنید',
      emailOrMobile: 'ایمیل یا شماره موبایل',
      emailOrMobilePlaceholder: 'ایمیل یا شماره موبایل خود را وارد کنید',
      sendResetLink: 'ارسال لینک بازنشانی',
      backToLogin: 'بازگشت به ورود',
      helpText:
        'کد تأیید بازنشانی رمز عبور را به شماره موبایل شما ارسال خواهیم کرد',
      validation: {
        identifierRequired: 'لطفاً ایمیل یا شماره موبایل خود را وارد کنید',
      },
      error: {
        requestFailed:
          'ارسال لینک بازنشانی ناموفق بود. لطفاً دوباره تلاش کنید.',
        customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
        accountInactive:
          'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        accountTypeNotFound:
          'نوع حساب کاربری یافت نشد. لطفاً با پشتیبانی تماس بگیرید.',
        networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
      },
      success: {
        title: 'لینک بازنشانی ارسال شد',
        subtitle: 'موبایل خود را برای کد تأیید بررسی کنید',
        message: 'کد تأیید بازنشانی رمز عبور به شماره {phone} ارسال شده است',
        expiresIn: 'کد تأیید تا {minutes} دقیقه معتبر است',
        tryAgain: 'ایمیل/موبایل دیگری امتحان کنید',
        resetPassword: 'بازنشانی رمز عبور',
        backToLogin: 'بازگشت به ورود',
      },
    },

    // Reset Password Page
    resetPassword: {
      title: 'بازنشانی رمز عبور',
      subtitle: 'رمز عبور جدید و کد تأیید را وارد کنید',
      forPhone: 'برای شماره موبایل: {phone}',
      otpCode: 'کد تأیید',
      otpHelp: 'کد ۶ رقمی ارسال شده به موبایل خود را وارد کنید',
      newPassword: 'رمز عبور جدید',
      newPasswordPlaceholder: 'رمز عبور جدید خود را وارد کنید',
      confirmPassword: 'تکرار رمز عبور',
      confirmPasswordPlaceholder: 'رمز عبور جدید را تکرار کنید',
      resetPassword: 'بازنشانی رمز عبور',
      backToLogin: 'بازگشت به ورود',
      requirements: {
        title: 'نیازمندی‌های رمز عبور',
        minLength: 'حداقل ۸ کاراکتر',
        letterAndDigit: 'حداقل ۱ حرف و ۱ رقم',
      },
      validation: {
        newPasswordRequired: 'لطفاً رمز عبور جدید را وارد کنید',
        passwordMin: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
        passwordUppercase: 'رمز عبور باید حداقل ۱ حرف بزرگ داشته باشد',
        passwordNumber: 'رمز عبور باید حداقل ۱ رقم داشته باشد',
        passwordStrength: 'رمز عبور باید حداقل ۱ حرف و ۱ رقم داشته باشد',
        passwordMismatch: 'رمزهای عبور مطابقت ندارند',
        otpRequired: 'لطفاً کد تأیید ۶ رقمی را وارد کنید',
      },
      error: {
        resetFailed: 'بازنشانی رمز عبور ناموفق بود. لطفاً دوباره تلاش کنید.',
        customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
        accountInactive:
          'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        accountTypeNotFound:
          'نوع حساب کاربری یافت نشد. لطفاً با پشتیبانی تماس بگیرید.',
        noValidOtp: 'کد تأیید معتبری یافت نشد. لطفاً کد جدیدی درخواست کنید.',
        invalidOtpCode: 'کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
        invalidOtpType: 'نوع کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
        otpExpired: 'کد تأیید منقضی شده است. لطفاً کد جدیدی درخواست کنید.',
        networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
        noCustomerId: 'لینک بازنشانی نامعتبر است. لطفاً دوباره تلاش کنید.',
      },
      success: {
        title: 'بازنشانی رمز عبور موفقیت‌آمیز',
        subtitle: 'رمز عبور شما به‌روزرسانی شده و اکنون وارد شده‌اید',
        message: 'شما با رمز عبور جدید به طور خودکار وارد شده‌اید',
        backToLogin: 'رفتن به داشبورد',
      },
    },

    // Signup Page
    signup: {
      title: 'حساب کاربری خود را بسازید',
      subtitle:
        'به پلتفرم هوشمند و داده‌محور بپیوندید و سفر بازاریابی هوشمند و داده‌محور خود را شروع کنید',
      accountType: 'نوع حساب کاربری',
      selectAccountType: 'نوع حساب را انتخاب کنید',
      individual: 'شخصی',
      independentCompany: 'شرکت مستقل',
      marketingAgency: 'آژانس بازاریابی',

      companyInfo: 'اطلاعات شرکت',
      companyName: 'نام شرکت',
      companyNamePlaceholder: 'نام شرکت را وارد کنید',
      nationalId: 'شناسه ملی',
      nationalIdPlaceholder: 'شناسه ملی ۱۱ رقمی',
      companyPhone: 'تلفن شرکت',
      companyPhonePlaceholder: 'شماره تلفن شرکت',
      postalCode: 'کد پستی',
      postalCodePlaceholder: 'کد پستی ۱۰ رقمی',
      companyAddress: 'آدرس شرکت',
      companyAddressPlaceholder: 'آدرس کامل شرکت را وارد کنید',

      personalInfo: 'اطلاعات شخصی',
      representativeInfo: 'اطلاعات نماینده',
      firstName: 'نام',
      firstNamePlaceholder: 'نام خود را وارد کنید',
      lastName: 'نام خانوادگی',
      lastNamePlaceholder: 'نام خانوادگی خود را وارد کنید',
      mobileNumber: 'شماره موبایل',
      mobilePlaceholder: '۰۹xxxxxxxxx',

      credentials: 'اطلاعات حساب کاربری',
      sheba: 'شماره شبا',
      shebaPlaceholder: '۲۴ رقم انگلیسی (بدون IR)',
      email: 'آدرس ایمیل',
      password: 'رمز عبور',
      passwordPlaceholder: 'رمز عبور را وارد کنید',
      confirmPassword: 'تکرار رمز عبور',
      confirmPasswordPlaceholder: 'رمز عبور را تکرار کنید',

      agencyCode: 'کد معرف آژانس (اختیاری)',
      agencyCodePlaceholder: 'در صورت داشتن کد آژانس وارد کنید',
      agencyCodeHelp: 'اگر توسط آژانسی معرفی شده‌اید، کد آن را اینجا وارد کنید',

      createAccount: 'ایجاد حساب کاربری',
      haveAccount: 'قبلاً حساب کاربری دارید؟',
      signInHere: 'اینجا وارد شوید',
      passwordRequirements: 'نیازمندی‌های رمز عبور',

      // OTP Modal
      verifyMobile: 'تأیید شماره موبایل شما',
      otpSent: 'کد تأیید ۶ رقمی به شماره زیر ارسال شده است',
      enterVerificationCode: 'کد تأیید را وارد کنید',
      verifyCode: 'تأیید کد',
      attemptsRemaining: 'تلاش باقی‌مانده:',
      maxAttemptsReached: 'حداکثر تلاش انجام شده است',
      resendIn: 'ارسال مجدد در',

      // Validation Messages
      validation: {
        required: 'این فیلد الزامی است',
        accountTypeRequired: 'لطفاً نوع حساب را انتخاب کنید',
        companyNameRequired: 'نام شرکت الزامی است',
        companyNameMax: 'نام شرکت باید حداکثر ۶۰ کاراکتر باشد',
        nationalIdRequired: 'شناسه ملی الزامی است',
        nationalIdFormat: 'شناسه ملی باید ۱۰ تا ۲۰ رقم باشد',
        companyPhoneRequired: 'تلفن شرکت الزامی است',
        companyPhoneMin: 'شماره تلفن باید حداقل ۱۰ رقم باشد',
        companyAddressRequired: 'آدرس شرکت الزامی است',
        companyAddressMax: 'آدرس باید حداکثر ۲۵۵ کاراکتر باشد',
        postalCodeRequired: 'کد پستی الزامی است',
        postalCodeFormat: 'کد پستی باید حداقل ۱۰ رقم باشد',
        firstNameRequired: 'نام الزامی است',
        lastNameRequired: 'نام خانوادگی الزامی است',
        mobileRequired: 'شماره موبایل الزامی است',
        mobileFormat: 'شماره موبایل باید به فرمت ۰۹xxxxxxxxx باشد',
        emailRequired: 'ایمیل الزامی است',
        emailFormat: 'لطفاً یک آدرس ایمیل معتبر وارد کنید',
        passwordRequired: 'رمز عبور الزامی است',
        passwordMin: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
        passwordUppercase: 'رمز عبور باید حداقل ۱ حرف بزرگ داشته باشد',
        passwordNumber: 'رمز عبور باید حداقل ۱ رقم داشته باشد',
        passwordStrength: 'رمز عبور باید حداقل ۱ حرف و ۱ رقم داشته باشد',
        confirmPasswordRequired: 'لطفاً رمز عبور را تأیید کنید',
        passwordMismatch: 'رمزهای عبور مطابقت ندارند',
        agencyCodeFormat: 'کد آژانس باید یک عدد معتبر باشد',
        invalidOtp: 'لطفاً یک کد تأیید ۶ رقمی معتبر وارد کنید',
        maxOtpAttempts: 'حداکثر تلاش انجام شده. لطفاً بعداً دوباره تلاش کنید.',
        shebaRequiredAgency: 'شماره شبا برای آژانس الزامی است',
        shebaDigits: 'شماره شبا باید فقط شامل ارقام انگلیسی باشد',
        shebaLength: 'شماره شبا باید دقیقاً ۲۴ رقم باشد (بدون IR)',
        shebaNotAllowed: 'برای این نوع حساب، شماره شبا نباید وارد شود',
      },
      success: 'حساب کاربری با موفقیت ایجاد شد! به پلتفرم هوشمند و داده‌محور خوش آمدید!',
      otpResent: 'کد تأیید جدید به شماره موبایل شما ارسال شد',
      error: {
        signupFailed: 'ایجاد حساب کاربری ناموفق بود. لطفاً دوباره تلاش کنید.',
        invalidOtp: 'کد تأیید نامعتبر. لطفاً دوباره تلاش کنید.',
        resendFailed: 'ارسال مجدد کد تأیید ناموفق بود. لطفاً دوباره تلاش کنید.',
        customerNotFound: 'مشتری یافت نشد. لطفاً اطلاعات خود را بررسی کنید.',
        accountInactive:
          'حساب کاربری غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        accountAlreadyVerified:
          'حساب کاربری قبلاً تأیید شده است. لطفاً وارد شوید.',
        emailExists:
          'آدرس ایمیل قبلاً وجود دارد. لطفاً از ایمیل دیگری استفاده کنید.',
        mobileExists:
          'شماره موبایل قبلاً وجود دارد. لطفاً از شماره دیگری استفاده کنید.',
        nationalIdExists:
          'کد ملی قبلاً وجود دارد. لطفاً اطلاعات خود را بررسی کنید.',
        accountTypeNotFound:
          'نوع حساب کاربری یافت نشد. لطفاً نوع حساب معتبری انتخاب کنید.',
        companyFieldsRequired: 'فیلدهای شرکت برای حساب‌های تجاری الزامی است.',
        referrerAgencyNotFound:
          'آژانس معرف یافت نشد. لطفاً کد آژانس را بررسی کنید.',
        referrerMustBeAgency: 'معرف باید یک آژانس بازاریابی باشد.',
        referrerAgencyInactive:
          'آژانس معرف غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.',
        noValidOtp: 'کد تأیید معتبری یافت نشد. لطفاً کد جدیدی درخواست کنید.',
        invalidOtpType: 'نوع کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.',
        otpExpired: 'کد تأیید منقضی شده است. لطفاً کد جدیدی درخواست کنید.',
        networkError: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
        noCustomerId: 'شناسه مشتری یافت نشد. لطفاً دوباره تلاش کنید.',
      },
    },

    // Dashboard
    dashboard: {
      title: 'داشبورد',
      welcome: 'خوش آمدید',
      subtitle:
        'کمپین‌های هوشمند و داده‌محور خود را مدیریت کنید و عملکرد خود را پیگیری کنید',
      language: 'زبان',
      logout: 'خروج',
      support: 'تیکت و پشتیبانی',
      supportIntro: 'برای ارتباط با پشتیبانی، یک تیکت ثبت کنید.',
      supportModal: {
        newTicket: 'تیکت جدید',
        title: 'ایجاد تیکت جدید',
        titleLabel: 'عنوان (اختیاری)',
        contentLabel: 'متن تیکت',
        fileLabel: 'ضمیمه (اختیاری)',
        titlePlaceholder: 'یک عنوان کوتاه وارد کنید (حداکثر ۸۰ کاراکتر)',
        contentPlaceholder: 'درخواست خود را توضیح دهید (حداکثر ۱۰۰۰ کاراکتر)',
        fields: {
          ticketTitle: 'عنوان (اختیاری، حداکثر ۸۰)',
          description: 'توضیحات',
          attachment: 'ضمیمه (اختیاری)',
          attachmentHelp: 'jpg, png, pdf, docx, xlsx, zip — تا ۱۰ مگابایت',
        },
        placeholders: {
          ticketTitle: 'یک عنوان کوتاه وارد کنید (حداکثر ۸۰ کاراکتر)',
          description: 'مشکل یا درخواست خود را توضیح دهید (حداکثر ۱۰۰۰ کاراکتر)',
        },
        validation: {
          titleMax: 'عنوان باید حداکثر ۸۰ کاراکتر باشد',
          descriptionRequired: 'متن تیکت الزامی است',
          descriptionMax: 'متن تیکت باید حداکثر ۱۰۰۰ کاراکتر باشد',
          invalidType: 'نوع فایل نامعتبر است. فرمت‌های مجاز: jpg, png, pdf, docx, xlsx, zip',
          maxSize: 'حجم فایل باید کمتر از ۱۰ مگابایت باشد',
        },
        replyTitle: 'پاسخ دادن',
        submit: 'ثبت تیکت',
        success: 'تیکت شما با موفقیت ثبت شد',
        error: 'ثبت تیکت ناموفق بود. لطفاً دوباره تلاش کنید.',
      },

      // Filters
      filterTitlePlaceholder: 'فیلتر بر اساس عنوان...'
,
      // Sort controls
      sortBy: 'مرتب‌سازی بر اساس',
      sortNewest: 'جدیدترین',
      sortOldest: 'قدیمی‌ترین',

      // Sidebar Navigation
      dashboard: 'داشبورد',
      targetedSend: 'ارسال هدفمند',
      reports: 'گزارشگیری',
      campaigns: 'کمپین و مشتریان',
      wallet: 'کیف پول و شارژ',
      customerManagement: 'مدیریت مشتریان',
      discountManagement: 'مدیریت تخفیف',
      customerDiscountManagement: 'مدیریت مشتری و تخفیف',

      // Stats
      stats: {
        totalCampaigns: 'تعداد کل کمپین‌ها',
        totalCustomers: 'تعداد کل مشتریان',
        walletBalance: 'موجودی کیف پول',
        activeTickets: 'تیکت‌های فعال',
      },

      // Content
      recentActivity: 'فعالیت‌های اخیر',
      noActivity: 'فعالیتی در حال حاضر وجود ندارد',
      reportsTable: {
        row: '#',
        title: 'عنوان',
        text: 'متن',
        lineNumber: 'شماره خط',
        segment: 'بخش',
        sent: 'ارسال شده',
        status: 'وضعیت',
        total: 'مجموع',
        createdAt: 'ایجاد شده',
        scheduleAt: 'زمان‌بندی',
        details: 'جزئیات',
        subsegments: 'زیربخش‌ها',
        sex: 'جنسیت',
        cities: 'شهرها',
        adlink: 'لینک تبلیغ',
        updatedAt: 'به‌روزرسانی',
      },
      reportsStatus: {
        initiated: 'آغاز شده',
        'in-progress': 'در حال انجام',
        'waiting-for-approval': 'در انتظار تأیید',
        approved: 'تأیید شده',
        rejected: 'رد شده',
      },
      fixAndRestart: 'اصلاح و شروع مجدد کمپین؟',
      supportHistory: 'تاریخچه تیکت‌ها',
    },

    // Campaign Creation
    campaign: {
      title: 'ایجاد کمپین هوشمند و داده‌محور',
      subtitle: 'کمپین هوشمند و داده‌محور هدفمند را در ۴ مرحله ساده ایجاد کنید',
      
      // Steps
      step1: 'بخش‌بندی',
      step2: 'محتوای پیام',
      step3: 'بودجه',
      step4: 'پرداخت',
      
      // Steps structure for StepHeader components
      steps: {
        segment: {
          title: 'بخش هدف خود را تعریف کنید',
          subtitle: 'معیارهای مخاطب هدف خود را انتخاب کنید',
        },
        content: {
          title: 'پیام خود را طراحی کنید',
          subtitle: 'محتوای جذاب برای کمپین هوشمند و داده‌محور خود ایجاد کنید',
        },
        budget: {
          title: 'بودجه خود را تنظیم کنید',
          subtitle: 'پارامترهای مالی کمپین خود را تعریف کنید',
        },
        payment: {
          title: 'پرداخت و تأیید',
          subtitle: 'جزئیات کمپین خود را بررسی و تأیید کنید',
        },
      },
      
      // Navigation
      nextPage: 'صفحه بعدی',
      previousPage: 'صفحه قبلی',
      finish: 'پایان',
      
      // Confirmation Modal
      confirmTitle: 'آیا مطمئن هستید؟',
      confirmMessage: 'آیا می‌خواهید ایجاد این کمپین را تمام کنید؟',
      yes: 'بله',
      no: 'خیر',
      
      // Loading
      creating: 'در حال ایجاد کمپین...',
      pleaseWait: 'لطفاً منتظر بمانید تا کمپین شما ایجاد شود.',
      
      // Success
      success: 'کمپین با موفقیت ایجاد شد!',
      redirecting: 'در حال بازگشت به داشبورد...',
      
      // Errors
      error: 'ایجاد کمپین ناموفق بود',
      tryAgain: 'لطفاً دوباره تلاش کنید.',
      
      // Step 1: Segment
      segment: {
        title: 'بخش هدف خود را تعریف کنید',
        subtitle: 'معیارهای مخاطب هدف خود را انتخاب کنید',
        
        // Campaign Title
        campaignTitle: 'عنوان کمپین',
        campaignTitlePlaceholder: 'عنوان کمپین را وارد کنید (حداکثر ۲۵۵ کاراکتر)',
        campaignTitleValidation: 'عنوان کمپین باید حداکثر ۲۵۵ کاراکتر باشد',
        
        // Segment Selection
        segment: 'بخش',
        segmentPlaceholder: 'یک بخش را انتخاب کنید',
        selectSegment: 'انتخاب بخش',
        
        // Subsegments
        subsegments: 'زیربخش‌ها',
        subsegmentsFor: 'زیربخش‌ها برای {segment}',
        subsegmentsHelp: 'حداقل یک زیربخش را انتخاب کنید (انتخاب چندگانه مجاز است)',
        subsegmentsValidation: 'لطفاً حداقل یک زیربخش را انتخاب کنید',
        
        // Sex Selection
        sex: 'جنسیت',
        sexPlaceholder: 'ترجیح جنسیت را انتخاب کنید',
        selectSex: 'انتخاب جنسیت',
        
        // City Selection
        cities: 'شهرها',
        citiesHelp: 'حداقل یک شهر را انتخاب کنید (انتخاب چندگانه مجاز است)',
        citiesPlaceholder: 'حداقل یک شهر را انتخاب کنید',
        citiesValidation: 'لطفاً حداقل یک شهر را انتخاب کنید',
        
        // Summary Section
        campaignSummary: 'خلاصه کمپین',
        campaignTitleLabel: 'عنوان کمپین:',
        segmentLabel: 'بخش:',
        subsegmentsLabel: 'زیربخش‌ها:',
        sexLabel: 'جنسیت:',
        citiesLabel: 'شهرها:',
        notSet: 'تنظیم نشده',
        
        // Campaign Capacity Section
        campaignCapacity: 'ظرفیت کمپین',
        capacityDescription: 'تعداد افرادی که بر اساس فیلترهای انتخاب شده پیام پیامکی شما را دریافت خواهند کرد',
        calculatingCapacity: 'در حال محاسبه ظرفیت...',
        capacityResult: '{count} نفر پیام پیامکی شما را دریافت خواهند کرد',
        capacityError: 'قادر به محاسبه ظرفیت نیست. لطفاً انتخاب‌های خود را بررسی کنید.',
        capacityHelp: 'ظرفیت به طور خودکار با تنظیم فیلترهای کمپین شما محاسبه می‌شود.',
        campaignCapacityHelp: 'ظرفیت به طور خودکار با تنظیم فیلترهای کمپین شما محاسبه می‌شود.',
        capacityTooLow: 'ظرفیت بسیار کم است (کمتر از ۵۰۰). چند فیلتر را حذف کنید تا ظرفیت افزایش یابد.',
         estimatedCapacity: 'ظرفیت تخمینی',
        calculating: 'در حال محاسبه...',
        users: 'کاربر',
        
        // Legacy fields (keeping for backward compatibility)
        customerType: 'نوع مشتری',
        customerTypePlaceholder: 'نوع مشتری را انتخاب کنید',
        ageRange: 'محدوده سنی',
        ageRangePlaceholder: 'محدوده سنی را انتخاب کنید',
        location: 'مکان',
        locationPlaceholder: 'شهر یا استان را وارد کنید',
        interests: 'علایق',
        interestsPlaceholder: 'علایق را انتخاب کنید',
        customFilters: 'فیلترهای سفارشی',
        addFilter: 'افزودن فیلتر',
        removeFilter: 'حذف',
        filterField: 'فیلد',
        filterOperator: 'عملگر',
        filterValue: 'مقدار',
        
        searchPlaceholder: 'جستجو کنید.',
      },
      
      // Step 2: Content
      content: {
        title: 'پیام خود را طراحی کنید',
        subtitle: 'محتوای جذاب برای کمپین پیامکی خود ایجاد کنید',
        
        // Insert Link Section
        insertLink: 'افزودن لینک',
        linkInsertionEnabled: 'افزودن لینک فعال است',
        linkInsertionDisabled: 'افزودن لینک غیرفعال است',
        on: 'فعال',
        off: 'غیرفعال',
        
        // Link Input Section
        link: 'لینک',
        campaignLink: 'لینک کمپین',
        linkPlaceholder: 'آدرس لینک را وارد کنید (حداکثر ۱۰۰۰۰ کاراکتر)',
        linkValidation: 'لینک باید حداکثر ۱۰۰۰۰ کاراکتر باشد',
        linkInvalidUrl: 'لطفاً یک آدرس لینک صحیح وارد کنید (باید با http:// یا https:// شروع شود)',
        insertLinkCharacter: 'افزودن لینک در اینجا',
        linkCharacterInserted: 'موقعیت لینک شناسایی شده',
        linkCharacterInsertedMessage: 'لینک در موقعیت شناسایی شده (🔗) قرار خواهد گرفت',
        characters: 'کاراکتر',
        
        // Text Content Section
        text: 'متن',
        campaignText: 'متن کمپین',
        textPlaceholder: 'متن پیام کمپین خود را وارد کنید',
        
        // Character Counter Section
        charactersLabel: 'کاراکترها: {count} (ورودی کاربر)',
        totalLabel: 'مجموع: {count} / {max}',
        partsLabel: 'تعداد پیام: {count}',
        partsCount: '{total}/{parts}',
        
        // Parts Explanation
        partsBreakdown: 'تجزیه تعداد پیام:',
        partsExplanation: '≤۷۰ کاراکتر = ۱ پیام، ≤۱۳۲ = ۲ پیام، ≤۱۹۸ = ۳ پیام، ≤۲۶۴ = ۴ پیام، ≤۳۳۰ = ۵ پیام',
        withLinkExplanation: 'با لینک: از ۲۰ کاراکتر شروع می‌شود (۶ لغو + ۱۴ لینک کوتاه)',
        withoutLinkExplanation: 'بدون لینک: از ۶ کاراکتر شروع می‌شود (اضافه کردن لغو)',
        
        // Warning Messages
        textExceedsLimit: '⚠️ متن از حداکثر طول مجاز فراتر رفته است. لطفاً پیام خود را کوتاه کنید.',
        
        // Schedule Section
        scheduleAt: 'زمان‌بندی (اختیاری)',
        enableSchedule: 'فعال کردن زمان‌بندی',
        disableSchedule: 'غیرفعال کردن زمان‌بندی',
        campaignScheduled: 'کمپین زمان‌بندی خواهد شد',
        campaignImmediate: 'کمپین فوراً ارسال خواهد شد',
        scheduleDateTime: 'تاریخ و زمان زمان‌بندی (زمان تهران)',
        schedulePlaceholder: 'تاریخ و زمان را انتخاب کنید',
        scheduledFor: 'زمان‌بندی شده برای: {datetime}',
        scheduleTooSoon: 'لطفاً زمانی حداقل ۲۰ دقیقه بعد از اکنون انتخاب کنید',
        
        // Content Summary Section
        contentSummary: 'خلاصه محتوا',
        linkInsertionLabel: 'افزودن لینک:',
        linkLabel: 'لینک:',
        textLabel: 'متن:',
        scheduleLabel: 'زمان‌بندی:',
        enabled: 'فعال',
        disabled: 'غیرفعال',
        immediate: 'فوری',
        notSet: 'تنظیم نشده',
      },
      
      // Step 3: Budget
      budget: {
        title: 'بودجه خود را تنظیم کنید',
        subtitle: 'پارامترهای مالی کمپین خود را تعریف کنید',
        
        // Line Number Selection
        lineNumber: 'شماره خط',
        selectLineNumber: 'انتخاب شماره خط',
        lineNumberPlaceholder: 'شماره خط کمپین خود را انتخاب کنید',
        lineNumberHelp: 'شماره خط تلفنی که برای ارسال پیام‌های پیامکی این کمپین استفاده خواهد شد را انتخاب کنید.',
        selectedLine: 'خط انتخاب شده',
        
        // Total Budget
        totalBudget: 'کل بودجه',
        campaignBudget: 'بودجه کمپین',
        budgetPlaceholder: 'مقدار بودجه را به تومان وارد کنید',
        budgetValidation: 'بودجه باید بین ۱ تا ۱۰۰,۰۰۰,۰۰۰,۰۰۰ تومان باشد',
        budget: 'بودجه',
        budgetHelp: 'کل بودجه کمپین خود را تنظیم کنید. سیستم محاسبه خواهد کرد که با این بودجه چند پیام می‌توان ارسال کرد.',
        
        // Estimated Messages
        estimatedMessages: 'تعداد پیام‌هایی که می‌توان ارسال کرد',
        calculatingMessages: 'در حال محاسبه پیام‌ها...',
        messages: 'پیام',
        basedOnBudget: 'بر اساس بودجه شما: {budget}',
        lastUpdated: 'آخرین به‌روزرسانی: {time}',
        calculating: 'در حال محاسبه...',
        enterBudgetToSee: 'بودجه را وارد کنید تا پیام‌های تخمینی را ببینید',
        estimatedMessagesHelp: 'این فیلد به طور خودکار توسط سیستم بر اساس بودجه شما و هزینه‌های فعلی پیام محاسبه می‌شود.',
        note: 'توجه:',
        notStored: 'این مقدار در داده‌های کمپین شما ذخیره نمی‌شود و در صورت نیاز مجدداً محاسبه خواهد شد.',
        
        // Budget Summary
        budgetSummary: 'خلاصه بودجه',
        lineNumberLabel: 'شماره خط:',
        totalBudgetLabel: 'کل بودجه:',
        estimatedMessagesLabel: 'تعداد پیام‌های تخمینی:',
        messageCountHelp: 'تعداد پیام‌هایی که می‌توان با بودجه شما ارسال کرد',
        calculateMessageCount: 'محاسبه تعداد پیام',
        calculatingMessageCount: 'در حال محاسبه تعداد پیام...',
        messageCountResult: '{count} پیام می‌توان با بودجه شما ارسال کرد',
        messageCountError: 'قادر به محاسبه تعداد پیام نیست. لطفاً انتخاب‌های خود را بررسی کنید.',
        notSelected: 'انتخاب نشده',
        notSet: 'تنظیم نشده',
        estimatedReach: 'دسترسی تخمینی',
        estimatedReachMessage: 'این نشان می‌دهد که کمپین شما بر اساس بودجه و معیارهای هدف‌گذاری می‌تواند به چند نفر برسد.',
        budgetSummaryHelp: 'قبل از ادامه به پرداخت، تخصیص بودجه و دسترسی تخمینی کمپین خود را بررسی کنید.',
        
        // Line number options
        line1: 'خط ۱ - خط اصلی کمپین',
        line2: 'خط ۲ - خط ثانویه',
        line3: 'خط ۳ - خط پشتیبانی',
        line4: 'خط ۴ - خط بازاریابی',
        line5: 'خط ۵ - خدمات مشتریان',
        
        // Wallet Balance Section
        walletBalance: 'موجودی کیف پول',
        checkingBalance: 'در حال بررسی موجودی کیف پول...',
        availableBalance: 'موجودی موجود',
        campaignCost: 'هزینه کمپین',
        toman: 'تومان',
        sufficientBalance: 'موجودی کافی برای کمپین',
        insufficientBalance: 'موجودی ناکافی برای کمپین',
        insufficientBalanceMessage: 'برای ادامه این کمپین باید موجودی کیف پول خود را افزایش دهید.',
        goToWallet: 'رفتن به کیف پول و شارژ',
        balanceError: 'خطا در بررسی موجودی کیف پول',
        retryBalance: 'تلاش مجدد',
        enterBudgetToCheck: 'بودجه را وارد کنید تا موجودی بررسی شود',
        balanceHelp: 'موجودی کیف پول شما در برابر هزینه کمپین بررسی می‌شود.',
      },
      
      // Step 4: Payment
      payment: {
        title: 'پرداخت و تأیید',
        subtitle: 'جزئیات کمپین خود را بررسی و تأیید کنید',
        
        // Campaign Summary Section
        campaignSummary: 'خلاصه کمپین',
        campaignTitle: 'عنوان کمپین:',
        segment: 'بخش:',
        subsegments: 'زیربخش‌ها:',
        subsegmentsSelected: '{count} انتخاب شده',
        sex: 'جنسیت:',
        cities: 'شهرها:',
        citiesSelected: '{count} انتخاب شده',
        messageLength: 'طول پیام:',
        characters: 'کاراکتر',
        linkInsertion: 'افزودن لینک:',
        enabled: 'فعال',
        disabled: 'غیرفعال',
        budget: 'بودجه:',
        lineNumber: 'شماره خط:',
        notSet: 'تنظیم نشده',
        
        // Cost Breakdown Section
        costBreakdown: 'تجزیه هزینه',
        calculatingCosts: 'در حال محاسبه هزینه‌ها...',
        total: 'مجموع',
        lastCalculated: 'آخرین محاسبه: {time}',
        calculatingCostsMessage: 'در حال محاسبه هزینه‌ها...',
        completeDetailsMessage: 'جزئیات کمپین را تکمیل کنید تا تجزیه هزینه را ببینید',
        costsHelp: 'هزینه‌ها به طور خودکار توسط سیستم بر اساس تنظیمات کمپین شما محاسبه می‌شود.',
        note: 'توجه:',
        costsNotStored: 'مقادیر هزینه در داده‌های کمپین شما ذخیره نمی‌شود و در صورت نیاز مجدداً محاسبه خواهد شد.',
        estimatedMessages: 'تعداد پیام‌های تخمینی',
        messages: 'پیام',
        costCalculationError: 'خطا در محاسبه هزینه‌ها',
        retryCalculation: 'تلاش مجدد',
        
        // Payment Method Section
        paymentMethod: 'روش پرداخت',
        creditCard: 'کارت اعتباری',
        creditCardDesc: 'با کارت اعتباری یا نقدی خود به صورت امن پرداخت کنید',
        wallet: 'کیف پول',
        walletDesc: 'از موجودی کیف پول خود برای پرداخت استفاده کنید',
        bankTransfer: 'انتقال بانکی',
        bankTransferDesc: 'مستقیماً از حساب بانکی خود انتقال وجه انجام دهید',
        
        // Terms and Conditions Section
        termsAndConditions: 'شرایط و ضوابط',
        acceptTerms: 'من با شرایط و ضوابط موافقت می‌کنم',
        termsHelp: 'با پذیرش این شرایط، شما با سیاست‌های کمپین و شرایط پرداخت ما موافقت می‌کنید. مبلغ کل نمایش داده شده در بالا پس از تکمیل کمپین از شما دریافت خواهد شد.',
        
        // Final Summary Section
        finalSummary: 'خلاصه نهایی',
        readyForPayment: 'کمپین شما آماده پرداخت است',
        totalLabel: 'مجموع',
        clickFinish: 'برای تکمیل کمپین خود روی "پایان" کلیک کنید',
        
        // Wallet Balance Section
        walletBalance: 'موجودی کیف پول',
        checkingBalance: 'در حال بررسی موجودی کیف پول...',
        availableBalance: 'موجودی موجود',
        campaignCost: 'هزینه کمپین',
        toman: 'تومان',
        sufficientBalance: 'موجودی کافی برای کمپین',
        insufficientBalance: 'موجودی ناکافی برای کمپین',
        insufficientBalanceMessage: 'برای ادامه این کمپین باید موجودی کیف پول خود را افزایش دهید.',
        goToWallet: 'رفتن به کیف پول و شارژ',
        balanceError: 'خطا در بررسی موجودی کیف پول',
        balanceErrorHelp: 'لطفاً بعداً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
        balanceNotAvailable: 'موجودی کیف پول در دسترس نیست',
        balanceHelp: 'موجودی کیف پول شما در برابر هزینه کمپین بررسی می‌شود.',
      },
    },

    // Home Page
    home: {
      hero: {
        badge: 'پلتفرم پیشرو بازاریابی هوشمند و داده‌محور',
        title: 'تصمیم‌های بازاریابی دقیق‌تر، با بینش داده‌محور',
        subtitle: 'از داده‌ها و ابزارهای هوشمند برای شناخت بهتر مشتریان، بهینه‌سازی مسیر جذب و طراحی لندینگ‌های بهتر استفاده کنید',
        cta: 'ورود به جاذبه',
        signin: 'ورود',
      },
      stats: {
        customers: 'مشتریان راضی',
        messages: 'پیام ارسال شده',
        delivery: 'نرخ تحویل',
        support: 'پشتیبانی مشتریان',
      },
      features: {
        title: 'چرا جاذبه را انتخاب کنید؟',
        subtitle:
          'ویژگی‌های قدرتمند طراحی شده برای کمک به موفقیت شما در بازاریابی هوشمند و داده‌محور',
        targeted: {
          title: 'کمپین‌های عملکردی مبتنی بر داده',
          description: 'کمپین‌های خود را بر اساس داده‌های رفتاری و تقسیم‌بندی هوشمند طراحی کنید و به نتیجهٔ بهتر برسید',
        },
        segmentation: {
          title: 'بخش‌بندی داده‌محور',
          description: 'کاربران را بر اساس رفتار، علاقه‌مندی و چرخهٔ عمر تقسیم‌بندی کنید تا اثرگذاری کمپین‌ها افزایش یابد',
        },
        analytics: {
          title: 'تحلیل داده و قیف‌های بازاریابی',
          description: 'مسیر کاربر تا اقدام نهایی را بررسی کنید و نقاط افت را با ابزارهای تحلیلی ما شناسایی کنید',
        },
        compliance: {
          title: 'اتومیشن بازاریابی و پیگیری هوشمند',
          description: 'فلوهای خودکار برای پیگیری سرنخ‌ها و مشتریان تعریف کنید و در زمان مناسب با آن‌ها تعامل داشته باشید',
        },
      },
      howItWorks: {
        title: 'چگونه جاذبه به شما کمک می‌کند',
        subtitle: 'در سه مرحله ساده با بازاریابی هوشمند و داده‌محور شروع کنید',
        step1: {
          title: 'ثبت‌نام کنید و اطلاعات کسب‌وکار خود را وارد کنید',
          description: 'امکان اتصال داده‌های موجود و تعریف اهداف بازاریابی شما فراهم است',
        },
        step2: {
          title: 'مسیرهای بازاریابی و لندینگ‌های خود را طراحی کنید',
          description: 'با کمک ابزارهای تحلیل و پیشنهاد هوش مصنوعی محتوای مناسب، زمان‌بندی و تقسیم‌بندی را انتخاب کنید',
        },
        step3: {
          title: 'پیاده‌سازی و پایش نتایج',
          description: 'عملکرد کمپین‌ها و مسیر مشتری را در لحظه بررسی کنید و با ابزار اتومیشن بازاریابی به‌طور خودکار بهینه‌سازی کنید',
        },
      },
      cta: {
        title: 'آماده‌اید بازاریابی داده‌محور را تجربه کنید؟',
        subtitle: 'به صدها شرکت و آژانسی بپیوندید که برای تصمیم‌گیری‌های بازاریابی از جاذبه استفاده می‌کنند',
        button: 'ورود به حساب / ثبت‌نام',
      },
    },

    // Error Boundary
    error: {
      title: 'چیزی به‌روزرسانی نشد',
      message:
        'متاسفانه، چیزی به‌روزرسانی نشد. لطفاً صفحه را دوباره بارگذاری کنید.',
      refresh: 'بارگذاری مجدد صفحه',
    },

    // Wallet Page
    wallet: {
      title: 'کیف پول و شارژ',
      comingSoon: 'به زودی',
      comingSoonMessage: 'عملکرد کیف پول و شارژ در حال توسعه است. به زودی می‌توانید موجودی خود را مدیریت کرده و وجوه اضافه کنید.',
      backToDashboard: 'بازگشت به داشبورد',
      currency: 'تومن',
      currentBalance: 'موجودی فعلی',
      free: 'آزاد',
      locked: 'قفل‌شده',
      reserved: 'رزرو شده',
      credit: 'اعتبار',
      total: 'جمع کل',
      lastUpdated: 'آخرین به‌روزرسانی',
      chargeTitle: 'شارژ کیف پول',
      amountLabel: 'مبلغ (تومان)',
      amountPlaceholder: 'مبلغ را وارد کنید',
      errorInvalidNumber: 'لطفاً یک عدد معتبر وارد کنید',
      errorMinAmount: 'مبلغ باید حداقل ۱۰۰,۰۰۰ تومان باشد',
      errorMultipleOf: 'مبلغ باید مضربی از ۱۰,۰۰۰ تومان باشد',
      pay: 'پرداخت',
      historyTitle: 'تاریخچه پرداخت و شارژ',
      table: {
        row: 'ردیف',
        datetime: 'تاریخ و زمان',
        type: 'نوع',
        status: 'وضعیت',
        freeIncrease: 'افزایش موجودی آزاد',
        creditIncrease: 'افزایش اعتبار',
        description: 'توضیحات',
        noTransactions: 'تراکنشی یافت نشد',
        createdAt: 'تاریخ ایجاد',
      },
      operationTypes: {
        'Wallet Recharge': 'شارژ کیف پول',
        'Wallet Withdrawal': 'برداشت از کیف پول',
        'Campaign Launch': 'راه‌اندازی کمپین',
        'Fund Freeze': 'مسدودسازی وجه',
        'Fund Unfreeze': 'آزادسازی وجه',
        'Fund Lock': 'قفل‌کردن وجه',
        'Fund Unlock': 'بازکردن قفل وجه',
        'Refund': 'بازپرداخت',
        'Service Fee': 'کارمزد خدمات',
        'Balance Adjustment': 'تعدیل موجودی',
      },
      statuses: {
        Pending: 'در انتظار',
        Completed: 'تکمیل‌شده',
        Failed: 'ناموفق',
        Cancelled: 'لغو شده',
        Reversed: 'معکوس شده',
      },
      modalTitle: 'تأیید پرداخت',
      modalChargeAmount: 'مبلغ شارژ:',
      modalTax: 'مالیات (۱۰٪):',
      modalTotal: 'مبلغ قابل پرداخت:',
    },

    // Common
    common: {
      loading: 'در حال بارگذاری...',
      required: '*',
      cancel: 'انصراف',
      close: 'بستن',
      save: 'ذخیره',
      edit: 'ویرایش',
      delete: 'حذف',
      confirm: 'تأیید',
      back: 'بازگشت',
      previous: 'قبلی',
      next: 'بعدی',
      submit: 'ارسال',
      resend: 'ارسال مجدد',
      seconds: 'ث',
      finish: 'پایان',
      continue: 'ادامه',
      yes: 'بله',
      no: 'خیر',
      comingSoon: 'به زودی',
      details: 'جزئیات',
      reply: 'پاسخ دادن',
    },

    // Agency Customer Report
    agencyReport: {
      startDate: 'تاریخ شروع',
      endDate: 'تاریخ پایان',
      selectStart: 'انتخاب تاریخ شروع',
      selectEnd: 'انتخاب تاریخ پایان',
      firstName: 'نام',
      lastName: 'نام خانوادگی',
      companyName: 'شرکت',
      totalSent: 'کل ارسال',
      totalShare: 'سهم کل (با مالیات)',
      totalSentAll: 'مجموع کل ارسال',
      totalShareAll: 'مجموع سهم کل',
      invalidRange: 'تاریخ پایان باید بزرگتر از تاریخ شروع باشد',
      name: 'فیلتر نام',
      namePlaceholder: 'فیلتر بر اساس نام...',
      applyFilters: 'اعمال فیلترها',
      tableTitle: 'گزارش مشتریان',
      discountsTitle: 'تخفیف‌های فعال',
      discountCustomer: 'مشتری',
      discountRate: 'نرخ (%)',
      discountCreatedAt: 'تاریخ ایجاد',
      discountCreateAction: 'ایجاد',
      discountHistoryAction: 'سوابق',
      discountHistoryTitle: 'تاریخچه تخفیف',
      discountCreateTitle: 'ایجاد تخفیف جدید',
      discountName: 'نام تخفیف',
      discountRateLabel: 'نرخ تخفیف (۰ تا ۰٫۵)',
      discountCreate: 'ایجاد',
      discountCancel: 'انصراف',
      discountNameRequired: 'نام الزامی است',
      discountRateInvalid: 'نرخ باید بیشتر از ۰ و کمتر از ۰٫۵ باشد',
      discountExpiresAt: 'تاریخ انقضا',
      discountGlobalCreate: 'ایجاد تخفیف',
      discountSelectCustomer: 'انتخاب مشتری',
    },

    // Support (Customer)
    supportPage: {
      title: 'تیکت و پشتیبانی',
      intro: 'برای ارتباط با پشتیبانی، یک تیکت ثبت کنید.',
      create: 'ایجاد تیکت',
      history: 'تاریخچه تیکت‌ها',
      modal: {
        title: 'ایجاد تیکت پشتیبانی',
        submit: 'ارسال',
        titleLabel: 'عنوان (اختیاری)',
        titlePlaceholder: 'یک عنوان کوتاه وارد کنید (حداکثر ۸۰ کاراکتر)',
        contentLabel: 'متن تیکت',
        contentPlaceholder: 'درخواست خود را توضیح دهید (حداکثر ۱۰۰۰ کاراکتر)',
        fileLabel: 'ضمیمه (اختیاری)',
        success: 'تیکت با موفقیت ایجاد شد'
      },
      table: {
        row: 'ردیف',
        title: 'عنوان',
        content: 'متن',
        createdAt: 'تاریخ ایجاد',
        details: 'جزئیات',
        noRecords: 'رکوردی یافت نشد'
      }
    },

    // Admin Tickets
    adminTickets: {
      title: 'تیکت‌های ادمین و پشتیبانی',
    },

    // Pricing
    pricing: {
      title: 'تعرفه‌ها',
      subtitle: 'قیمت‌گذاری ساده و شفاف که با شما رشد می‌کند',
      intro: {
        title: 'نحوه قیمت‌گذاری',
        description: 'برای استفاده از امکانات جاذبه، لازم است حساب خود را در جاذبه شارژ کنید. شما می‌توانید با شارژ کیف پول دیجیتال خود، از همهٔ خدمات جاذبه مانند طراحی و بهبود لندینگ‌ها، ترکینگ لیدهای بازاریابی، تحلیل مسیر مشتریان و اتومیشن بازاریابی بهره‌مند شوید. هزینهٔ هر سرویس بر اساس حجم استفاده (تعداد کمپین‌های فعال، تعداد سگمنت‌های پردازش‌شده، و امکانات تحلیلی) محاسبه می‌شود و مالیات قانونی (٪۱۰) به‌صورت شفاف از شارژ کسر می‌شود. با خرید اعتبار بیشتر، از تخفیف‌های پلن‌های Basic، Pro و Enterprise نیز بهره‌مند خواهید شد.',
        payAsYouGo: {
          title: 'پرداخت بر اساس استفاده',
          description: 'محاسبه بر اساس میزان استفاده واقعی'
        },
        transparent: {
          title: 'هزینه‌های شفاف',
          description: 'مالیات ۱۰٪ در همه تراکنش‌ها لحاظ شده است'
        },
        volume: {
          title: 'تخفیف حجمی',
          description: 'با خرید اعتبار بیشتر، بیشتر صرفه‌جویی کنید'
        }
      },
      plans: {
        title: 'پلن خود را انتخاب کنید',
        popular: 'محبوب',
        getStarted: 'شروع کنید',
        basic: {
          name: 'پایه',
          description: 'مناسب برای کسب‌وکارهای کوچک',
          discount: '۵٪ تخفیف',
          features: {
            campaigns: 'تا ۱۰ کمپین فعال',
            segments: 'سگمنت‌بندی پایه',
            analytics: 'تحلیل‌های استاندارد',
            support: 'پشتیبانی ایمیلی'
          }
        },
        pro: {
          name: 'حرفه‌ای',
          description: 'برای کسب‌وکارهای در حال رشد با نیازهای پیشرفته',
          discount: '۱۰٪ تخفیف',
          features: {
            campaigns: 'تا ۵۰ کمپین فعال',
            segments: 'سگمنت‌بندی پیشرفته',
            analytics: 'تحلیل و ردیابی پیشرفته',
            automation: 'اتومیشن بازاریابی',
            support: 'پشتیبانی اولویت‌دار'
          }
        },
        enterprise: {
          name: 'سازمانی',
          description: 'راهکارهای سفارشی برای سازمان‌های بزرگ',
          discount: '۱۵٪ تخفیف',
          features: {
            campaigns: 'کمپین‌های نامحدود',
            segments: 'سگمنت‌بندی سفارشی',
            analytics: 'تحلیل‌های سازمانی',
            automation: 'مجموعه کامل اتومیشن',
            support: 'مدیر اختصاصی حساب',
            custom: 'یکپارچه‌سازی‌های سفارشی'
          }
        }
      },
      cta: {
        title: 'آماده شروع هستید؟',
        description: 'همین امروز حساب خود را ایجاد کنید و اولین کمپین خود را شروع کنید',
        signup: 'ثبت‌نام کنید',
        contact: 'تماس با فروش'
      }
    },
  },
};

export type TranslationKey = keyof typeof translations.en;
