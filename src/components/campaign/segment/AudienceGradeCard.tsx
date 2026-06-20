import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { AudienceGrade } from '../../../types/campaign';
import Card from '../../ui/Card';

interface AudienceGradeCardProps {
  title: string;
  gradeALabel: string;
  gradeBLabel: string;
  gradeCLabel: string;
  selectedGrades: AudienceGrade[];
  gradeCapacities: Record<AudienceGrade, number>;
  onChange: (grades: AudienceGrade[]) => void;
  unitsLabel: string;
}

const GRADES: AudienceGrade[] = ['A', 'B', 'C'];

const AudienceGradeCard: React.FC<AudienceGradeCardProps> = ({
  title,
  gradeALabel,
  gradeBLabel,
  gradeCLabel,
  selectedGrades,
  gradeCapacities,
  onChange,
  unitsLabel,
}) => {
  const { language } = useLanguage();

  const gradeLabels: Record<AudienceGrade, string> = {
    A: gradeALabel,
    B: gradeBLabel,
    C: gradeCLabel,
  };

  const formatNumber = (n: number) => {
    try {
      return language === 'fa'
        ? n.toLocaleString('fa-IR')
        : n.toLocaleString('en-US');
    } catch {
      return String(n);
    }
  };

  const handleToggle = (grade: AudienceGrade) => {
    if (selectedGrades.includes(grade)) {
      onChange(selectedGrades.filter(g => g !== grade));
    } else {
      onChange([...selectedGrades, grade]);
    }
  };

  return (
    <Card className='mt-4'>
      <div className='space-y-3'>
        <p className='text-sm font-medium text-gray-900'>{title}</p>
        <div className='flex flex-col gap-3 sm:flex-row sm:gap-6'>
          {GRADES.map(grade => {
            const isSelected = selectedGrades.includes(grade);
            const capacity = gradeCapacities[grade];
            return (
              <label
                key={grade}
                className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 flex-1 transition-colors ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type='checkbox'
                  className='h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                  checked={isSelected}
                  onChange={() => handleToggle(grade)}
                />
                <span className='flex flex-col'>
                  <span className='text-sm font-medium text-gray-800'>
                    {gradeLabels[grade]}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {formatNumber(capacity)} {unitsLabel}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default AudienceGradeCard;
