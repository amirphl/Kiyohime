import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmationModal from '../components/ConfirmationModal';
import adminApi from '../services/adminApi';
import { TicketGroup } from '../types/admin';

const AdminTicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<TicketGroup[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TicketGroup | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const replyOnceRef = useRef(false);

  const onceRef = useRef(false);

  const fetchOnce = async () => {
    if (onceRef.current) return;
    onceRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const resp = await adminApi.listTickets({ page: 1, page_size: 50 });
      if (resp.success && resp.data) {
        setGroups(resp.data.groups || []);
      } else {
        setError(resp.message || 'Failed to load tickets');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnce();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">{t('adminTickets.title') || 'Admin Tickets'}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading ? (
              <div className="text-sm text-gray-600">{t('common.loading') || 'Loading...'}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groups.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No records</td>
                      </tr>
                    ) : (
                      groups.map((g, idx) => {
                        const last = (g.items || [])[0];
                        const customer = [last?.customer_first_name, last?.customer_last_name].filter(Boolean).join(' ') || last?.company_name || last?.phone_number || '-';
                        return (
                          <tr key={g.correlation_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-[220px] truncate" title={customer}>{customer}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-[220px] truncate" title={last?.title || ''}>{last?.title || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 max-w-[280px] truncate" title={last?.content || ''}>{last?.content || '-'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{last?.created_at ? new Date(last.created_at).toLocaleString() : '-'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                              <Button
                                variant="outline"
                                onClick={() => { setSelectedGroup(g); setDetailsOpen(true); }}
                              >
                                {t('common.details') || 'Details'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>

      <ConfirmationModal
        isOpen={detailsOpen}
        onConfirm={() => setDetailsOpen(false)}
        onCancel={() => setDetailsOpen(false)}
        title={t('common.details') || 'Details'}
        confirmText={t('common.close') || 'Close'}
        cancelText={t('common.cancel')}
      >
        <div className="space-y-3 max-h-[60vh] overflow-auto">
          {selectedGroup ? (
            selectedGroup.items.map(it => (
              <div key={it.id} className="p-3 border rounded-md relative">
                {it.replied_by_admin && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {language === 'fa' ? 'پاسخ ادمین' : 'Admin Reply'}
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-500">{new Date(it.created_at).toLocaleString()}</div>
                <div className="font-medium text-gray-900 mt-1">{it.title || '-'}</div>
                <div className="text-gray-700 mt-1 whitespace-pre-wrap">{it.content || '-'}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No records</div>
          )}
          <div className="pt-2 text-right">
            <Button onClick={() => { setReplyOpen(true); setReplyError(null); setReplyContent(''); setReplyFile(null); }} variant="primary">{t('common.reply') || 'Reply'}</Button>
          </div>
        </div>
      </ConfirmationModal>

      {/* Reply Modal */}
      <ConfirmationModal
        isOpen={replyOpen}
        onConfirm={async () => {
          if (replyOnceRef.current || replySubmitting) return;
          replyOnceRef.current = true;
          setReplySubmitting(true);
          setReplyError(null);
          try {
            const ticketId = selectedGroup?.items?.[0]?.id;
            if (!ticketId) throw new Error('Ticket id not found');
            const resp = await adminApi.createTicketReply({ ticket_id: ticketId, content: replyContent, file: replyFile || undefined });
            if (resp.success) {
              setReplyOpen(false);
              setReplyContent('');
              setReplyFile(null);
              // Optionally refresh list later
            } else {
              setReplyError(resp.message || 'Failed to send reply');
            }
          } catch (e) {
            setReplyError(e instanceof Error ? e.message : 'Network error');
          } finally {
            setReplySubmitting(false);
            replyOnceRef.current = false;
          }
        }}
        onCancel={() => setReplyOpen(false)}
        title={t('common.reply') || 'Reply'}
        confirmText={t('common.submit') || 'Submit'}
        cancelText={t('common.cancel')}
        loading={replySubmitting}
      >
        <div className="space-y-3">
          {replyError && <div className="text-sm text-red-600">{replyError}</div>}
          <div>
            <label htmlFor="adminReplyContent" className="block text-sm font-medium text-gray-700">{t('dashboard.supportModal.contentLabel') || 'Content'}</label>
            <textarea
              id="adminReplyContent"
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-primary-500 border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="adminReplyFile" className="block text-sm font-medium text-gray-700">{t('dashboard.supportModal.fileLabel') || 'Attachment (optional)'}</label>
            <input id="adminReplyFile" type="file" onChange={(e) => setReplyFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default AdminTicketsPage; 