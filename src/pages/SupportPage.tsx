import React, { useEffect, useRef, useState } from 'react';
import { Headphones, Plus } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmationModal from '../components/ConfirmationModal';
import { apiService } from '../services/api';

const SupportPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { accessToken } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ title?: string; content?: string; file?: string } | null>(null);
  const submitGuardRef = useRef(false);

  // Tickets state
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Array<{ correlation_id: string; items: Array<{ id: number; title: string; content: string; created_at: string; replied_by_admin?: boolean | null }> }>>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{ correlation_id: string; items: Array<{ id: number; title: string; content: string; created_at: string; replied_by_admin?: boolean | null }> } | null>(null);

  // Reply modal state
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);
  const replyGuardRef = useRef(false);

  const loadTicketsOnceRef = useRef(false);

  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [accessToken]);

  const fetchTickets = async (force: boolean = false) => {
    if (!force && loadTicketsOnceRef.current) return;
    loadTicketsOnceRef.current = true;
    setLoadingTickets(true);
    setTicketsError(null);
    try {
      const resp = await apiService.listSupportTickets({ page: 1, page_size: 50 });
      if (resp.success && resp.data) {
        setGroups(resp.data.groups || []);
      } else {
        setTicketsError(resp.message || 'Failed to load tickets');
      }
    } catch (e) {
      setTicketsError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTickets();
    }
  }, [accessToken]);

  const validate = (): boolean => {
    const errs: { title?: string; content?: string; file?: string } = {};
    if (title.length > 80) errs.title = t('dashboard.supportModal.validation.titleMax');
    if (!content.trim()) errs.content = t('dashboard.supportModal.validation.descriptionRequired');
    else if (content.length > 1000) errs.content = t('dashboard.supportModal.validation.descriptionMax');
    if (file) {
      const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'];
      if (!allowed.includes(file.type)) errs.file = t('dashboard.supportModal.validation.invalidType');
      if (file.size > 10 * 1024 * 1024) errs.file = t('dashboard.supportModal.validation.maxSize');
    }
    setErrors(Object.keys(errs).length ? errs : null);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFile(null);
    setErrors(null);
  };

  const resetReplyForm = () => {
    setReplyContent('');
    setReplyFile(null);
    setReplyError(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCreateTicket = async () => {
    if (submitGuardRef.current || submitting) return;
    if (!validate()) return;
    submitGuardRef.current = true;
    setSubmitting(true);

    try {
      // use existing apiService.createSupportTicket which posts multipart when file is present
      const resp = await apiService.createSupportTicket({ title, content, file });
      if (resp.success) {
        setShowModal(false);
        resetForm();
        alert(t('dashboard.supportModal.success') || 'Ticket created successfully');
        // Refetch tickets to populate the table
        fetchTickets(true);
      } else {
        const msg = resp?.message || 'Failed to create ticket';
        setErrors(prev => ({ ...(prev || {}), title: undefined, content: msg }));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error';
      setErrors(prev => ({ ...(prev || {}), content: msg }));
    } finally {
      setSubmitting(false);
      submitGuardRef.current = false;
    }
  };

  const validateReply = (): boolean => {
    if (!replyContent.trim()) {
      setReplyError(t('dashboard.supportModal.validation.descriptionRequired') || 'Content is required');
      return false;
    }
    if (replyContent.length > 1000) {
      setReplyError(t('dashboard.supportModal.validation.descriptionMax') || 'Content must be at most 1000 characters');
      return false;
    }
    if (replyFile) {
      const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'];
      if (!allowed.includes(replyFile.type)) {
        setReplyError(t('dashboard.supportModal.validation.invalidType') || 'Invalid file type');
        return false;
      }
      if (replyFile.size > 10 * 1024 * 1024) {
        setReplyError(t('dashboard.supportModal.validation.maxSize') || 'File is too large');
        return false;
      }
    }
    setReplyError(null);
    return true;
  };

  const handleReply = async () => {
    if (replyGuardRef.current || replySubmitting) return;
    if (!validateReply()) return;
    
    const ticketId = selectedGroup?.items?.[0]?.id;
    if (!ticketId) {
      setReplyError('Ticket ID not found');
      return;
    }

    replyGuardRef.current = true;
    setReplySubmitting(true);
    setReplyError(null);

    try {
      const resp = await apiService.createTicketReply({ ticket_id: ticketId, content: replyContent, file: replyFile });
      if (resp.success) {
        setReplyOpen(false);
        resetReplyForm();
        alert(t('dashboard.supportModal.success') || 'Reply sent successfully');
        // Refetch tickets
        loadTicketsOnceRef.current = false;
        fetchTickets(true);
        setDetailsOpen(false);
      } else {
        setReplyError(resp?.message || 'Failed to send reply');
      }
    } catch (e) {
      setReplyError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setReplySubmitting(false);
      replyGuardRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Headphones className="h-6 w-6 mr-2 text-red-600" />
                {t('dashboard.support') || 'Ticket & Support'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={openModal} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.supportModal.newTicket') || 'Create Ticket'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="space-y-4">
            <p className="text-gray-700">{t('dashboard.supportIntro') || 'Open a ticket to contact our support team.'}</p>
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">{t('dashboard.supportHistory') || 'Tickets History'}</h2>
              {ticketsError && (
                <div className="text-sm text-red-600">{ticketsError}</div>
              )}
              {loadingTickets ? (
                <div className="text-sm text-gray-600">{t('common.loading') || 'Loading...'}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.row') || '#'}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.supportModal.titleLabel') || 'Title'}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.supportModal.contentLabel') || 'Content'}</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.datetime') || 'Created At'}</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.details') || 'Details'}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groups.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-gray-500">{t('wallet.table.noTransactions') || 'No records'}</td>
                        </tr>
                      ) : (
                        groups.map((g, idx) => {
                          const last = (g.items || [])[0];
                          return (
                            <tr key={g.correlation_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-[360px] truncate" title={last?.title || ''}>{last?.title || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-500 max-w-[600px] truncate" title={last?.content || ''}>{last?.content || '-'}</td>
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
          </div>
        </Card>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleCreateTicket}
        onCancel={() => setShowModal(false)}
        title={t('dashboard.supportModal.title') || 'Create Support Ticket'}
        confirmText={t('dashboard.supportModal.submit') || 'Submit'}
        cancelText={t('common.cancel')}
        loading={submitting}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="ticketTitle" className="block text-sm font-medium text-gray-700">{t('dashboard.supportModal.titleLabel') || 'Title (optional)'}</label>
            <input
              id="ticketTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('dashboard.supportModal.titlePlaceholder') || 'Enter a short title (<= 80 chars)'}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-primary-500 border-gray-300"
            />
            {errors?.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="ticketContent" className="block text-sm font-medium text-gray-700">{t('dashboard.supportModal.contentLabel') || 'Content'}</label>
            <textarea
              id="ticketContent"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('dashboard.supportModal.contentPlaceholder') || 'Describe your request (<= 1000 chars)'}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-primary-500 border-gray-300"
            />
            {errors?.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
          </div>
          <div>
            <label htmlFor="ticketFile" className="block text-sm font-medium text-gray-700">{t('dashboard.supportModal.fileLabel') || 'Attachment (optional)'}</label>
            <input
              id="ticketFile"
              type="file"
              onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="w-full"
            />
            {errors?.file && <p className="text-sm text-red-600 mt-1">{errors.file}</p>}
          </div>
        </div>
      </ConfirmationModal>

      {/* Group Details Modal */}
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
            <>
              {selectedGroup.items.map(it => (
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
              ))}
              <div className="pt-2">
                <Button onClick={() => { setReplyOpen(true); resetReplyForm(); }} className="w-full" variant="primary">
                  {t('common.reply') || 'Reply'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">{t('wallet.table.noTransactions') || 'No records'}</div>
          )}
        </div>
      </ConfirmationModal>

      {/* Reply Modal */}
      <ConfirmationModal
        isOpen={replyOpen}
        onConfirm={handleReply}
        onCancel={() => setReplyOpen(false)}
        title={t('dashboard.supportModal.replyTitle') || 'Reply to Ticket'}
        confirmText={t('dashboard.supportModal.submit') || 'Submit Reply'}
        cancelText={t('common.cancel')}
        loading={replySubmitting}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="replyContent" className="block text-sm font-medium text-gray-700">{t('dashboard.supportModal.contentLabel') || 'Content'}</label>
            <textarea
              id="replyContent"
              rows={5}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('dashboard.supportModal.contentPlaceholder') || 'Describe your reply (<= 1000 chars)'}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-primary-500 border-gray-300"
            />
            {replyError && <p className="text-sm text-red-600 mt-1">{replyError}</p>}
          </div>
          <div>
            <label htmlFor="replyFile" className="block text-sm font-medium text-gray-700">{t('dashboard.supportModal.fileLabel') || 'Attachment (optional)'}</label>
            <input
              id="replyFile"
              type="file"
              onChange={(e) => setReplyFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="w-full"
            />
            {replyError && <p className="text-sm text-red-600 mt-1">{replyError}</p>}
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default SupportPage; 