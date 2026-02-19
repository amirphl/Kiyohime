import React from 'react';

interface CategoryJobStrings {
  categoryHeader: string;
  category: string;
  selectCategory: string;
  job: string;
  selectJob: string;
}

interface Props {
  category: string;
  job: string;
  errors?: { category?: string; job?: string };
  onChange: (field: 'jobCategory' | 'job', value: string) => void;
  requiredLabel: React.ReactNode;
  strings: CategoryJobStrings;
  categories: Record<string, readonly string[]>;
}

const CategoryJobFields: React.FC<Props> = ({
  category,
  job,
  errors,
  onChange,
  requiredLabel,
  strings,
  categories,
}) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    <div className='md:col-span-2 mb-2'>
      <p className='text-sm text-gray-600'>{strings.categoryHeader}</p>
    </div>
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {strings.category} {requiredLabel}
      </label>
      <select
        name='jobCategory'
        value={category}
        onChange={e => onChange('jobCategory', e.target.value)}
        className='input-field'
      >
        <option value=''>{strings.selectCategory}</option>
        {Object.keys(categories).map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {errors?.category && <p className='mt-1 text-sm text-red-600'>{errors.category}</p>}
    </div>

    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {strings.job} {requiredLabel}
      </label>
      <select
        name='job'
        value={job}
        onChange={e => onChange('job', e.target.value)}
        className='input-field'
        disabled={!category}
      >
        <option value=''>{strings.selectJob}</option>
        {(categories[category] || []).map(j => (
          <option key={j} value={j}>
            {j}
          </option>
        ))}
      </select>
      {errors?.job && <p className='mt-1 text-sm text-red-600'>{errors.job}</p>}
    </div>
  </div>
);

export default CategoryJobFields;
