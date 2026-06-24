import React from 'react';
import FormField from '../../../components/ui/FormField';
import { useLanguage } from '../../../hooks/useLanguage';
import { getJobCategories } from '../../../locales/jobCategory';
import { BundleCreateFormValues } from '../../../types/bundle';
import { BundlesCopy } from '../translations';

interface BundleTestCustomerSectionProps {
  copy: BundlesCopy;
  values: BundleCreateFormValues;
  onCustomerNameChange: (value: string) => void;
  onJobCategoryChange: (value: string) => void;
  onJobChange: (value: string) => void;
}

const BundleTestCustomerSection: React.FC<BundleTestCustomerSectionProps> = ({
  copy,
  values,
  onCustomerNameChange,
  onJobCategoryChange,
  onJobChange,
}) => {
  const { language } = useLanguage();
  const categories = getJobCategories(language);
  const categoryOptions = Object.keys(categories).map(category => ({
    label: category,
    value: category,
  }));
  const jobOptions = (categories[values.jobCategory] || []).map(job => ({
    label: job,
    value: job,
  }));

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6 flex flex-wrap items-center gap-3'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {copy.createPage.sections.testCustomer}
        </h2>
        <span className='rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700'>
          {copy.createPage.optional}
        </span>
      </div>

      <p className='mb-5 text-sm text-gray-500'>
        {copy.createPage.helper.testCustomer}
      </p>

      <div className='grid gap-5 lg:grid-cols-3'>
        <FormField
          id='bundle-customer-name'
          label={copy.createPage.fields.customerName}
          type='text'
          value={values.customerName}
          onChange={onCustomerNameChange}
          placeholder={copy.createPage.placeholders.customerName}
        />

        <FormField
          id='bundle-job-category'
          label={copy.createPage.fields.jobCategory}
          type='select'
          value={values.jobCategory}
          onChange={onJobCategoryChange}
          placeholder={copy.createPage.placeholders.jobCategory}
          options={categoryOptions}
        />

        <FormField
          id='bundle-job'
          label={copy.createPage.fields.job}
          type='select'
          value={values.job}
          onChange={onJobChange}
          placeholder={copy.createPage.placeholders.job}
          options={jobOptions}
          disabled={!values.jobCategory}
          inputClassName={
            !values.jobCategory ? 'bg-gray-100 text-gray-400' : ''
          }
        />
      </div>
    </section>
  );
};

export default BundleTestCustomerSection;
