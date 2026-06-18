import React, { useMemo } from 'react';
import { Briefcase, FileText, Target, User, Users } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { BundleListItem } from '../../../types/bundle';
import { BundlesCopy } from '../translations';
import {
  getBundleCategory,
  getBundleCustomerName,
  getBundleObjective,
  getBundlePersona,
} from '../utils';

interface BundleOverviewSectionProps {
  bundle: BundleListItem;
  copy: BundlesCopy;
}

const itemClass =
  'rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-sm';

const BundleOverviewSection: React.FC<BundleOverviewSectionProps> = ({
  bundle,
  copy,
}) => {
  const { user } = useAuth();
  const isAgency = user?.account_type === 'marketing_agency';

  const fields = useMemo(() => {
    const baseFields = [
      {
        label: copy.detailPage.fields.objective,
        value: getBundleObjective(bundle, copy.states.unknown),
        icon: <Target className='h-5 w-5 text-primary-600' />,
      },
      {
        label: copy.detailPage.fields.persona,
        value: getBundlePersona(bundle, copy.states.unknown),
        icon: <Users className='h-5 w-5 text-primary-600' />,
      },
    ];

    if (isAgency) {
      baseFields.push(
        {
          label: copy.detailPage.fields.customerName,
          value: getBundleCustomerName(bundle),
          icon: <User className='h-5 w-5 text-primary-600' />,
        },
        {
          label: copy.detailPage.fields.category,
          value: getBundleCategory(bundle, copy.states.unknown),
          icon: <Briefcase className='h-5 w-5 text-primary-600' />,
        }
      );
    }

    return baseFields;
  }, [bundle, copy, isAgency]);

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {copy.detailPage.sections.overview}
        </h2>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {fields.map(field => (
          <article key={field.label} className={itemClass}>
            <div className='mb-3 flex items-center gap-2'>
              {field.icon}
              <h3 className='text-sm font-semibold text-gray-700'>
                {field.label}
              </h3>
            </div>
            <p className='text-base leading-7 text-gray-900'>{field.value}</p>
          </article>
        ))}

        <article className='md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-sm'>
          <div className='mb-3 flex items-center gap-2'>
            <FileText className='h-5 w-5 text-primary-600' />
            <h3 className='text-sm font-semibold text-gray-700'>
              {copy.detailPage.fields.description}
            </h3>
          </div>
          <p className='text-base leading-7 text-gray-900'>
            {bundle.description?.trim() || copy.detailPage.values.notAvailable}
          </p>
        </article>
      </div>
    </section>
  );
};

export default BundleOverviewSection;
