import React, { useMemo } from 'react';
import {
  BookOpen,
  Briefcase,
  FileText,
  Layers,
  Target,
  User,
  Users,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { BundleListItem } from '../../../types/bundle';
import { BundlesCopy } from '../translations';
import {
  getBundleCustomerName,
  getBundleJob,
  getBundleJobCategory,
  getBundleObjective,
  getBundlePersona,
  getBundleTitle,
} from '../utils';

interface BundleOverviewSectionProps {
  bundle: BundleListItem;
  copy: BundlesCopy;
  onEdit?: () => void;
}

const itemClass =
  'rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-sm';

const BundleOverviewSection: React.FC<BundleOverviewSectionProps> = ({
  bundle,
  copy,
  onEdit,
}) => {
  const { user } = useAuth();
  const isAgency = user?.account_type === 'marketing_agency';

  const fields = useMemo(() => {
    const items: Array<{
      label: string;
      value: string;
      icon: React.ReactNode;
      colSpan?: boolean;
    }> = [
      {
        label: copy.detailPage.fields.title,
        value: getBundleTitle(bundle, copy.states.unknown),
        icon: <BookOpen className='h-5 w-5 text-primary-600' />,
        colSpan: true,
      },
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
      items.push(
        {
          label: copy.detailPage.fields.customerName,
          value: getBundleCustomerName(bundle),
          icon: <User className='h-5 w-5 text-primary-600' />,
        },
        {
          label: copy.detailPage.fields.category,
          value: getBundleJobCategory(bundle) || copy.states.unknown,
          icon: <Briefcase className='h-5 w-5 text-primary-600' />,
        },
        {
          label: copy.detailPage.fields.job,
          value: getBundleJob(bundle) || copy.states.unknown,
          icon: <Layers className='h-5 w-5 text-primary-600' />,
        }
      );
    }

    return items;
  }, [bundle, copy, isAgency]);

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6 flex items-center justify-between gap-3'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {copy.detailPage.sections.overview}
        </h2>
        {onEdit ? (
          <Button variant='outline' onClick={onEdit}>
            {copy.detailPage.actions.edit}
          </Button>
        ) : null}
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {fields.map(field => (
          <article
            key={field.label}
            className={`${itemClass}${field.colSpan ? ' md:col-span-2' : ''}`}
          >
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
