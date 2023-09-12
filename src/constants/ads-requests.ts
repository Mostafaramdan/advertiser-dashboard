export const SORT_TYPES = {
  latest: 'الأحدث',
  oldest: 'الأقدم',
  most_total: 'الاعلى سعر',
  latest_total: 'الاقل سعر',
}

export const ADS_REQUEST_STATUSES = [
  {
    id: 'uploading',
    label: 'جاري التحميل',
  },
  {
    id: 'pending',
    label: 'طلب جديد',
  },
  {
    id: 'pending_payment',
    label: 'تم موافقة العميل / بانتظار الدفع',
  },
  {
    id: 'transfer_rejected',
    label: 'الدفع مرفوض',
  },
  {
    id: 'stop_execution_rejected',
    label: 'تم رفض ايقاف التنفيذ',
  },
  {
    id: 'bill_added',
    label: 'تم التسعير',
  },
  {
    id: 'bill_edited',
    label: 'تم التسعير "في حالة اعادة التسعير"',
  },
  {
    id: 'rejected_by_advertiser',
    label: 'مرفوض من المعلن',
  },
  {
    id: 'rejected_by_client',
    label: 'مرفوض من العميل',
  },
  {
    id: 'paid',
    label: 'تم الدفع في حالة الدفع الخارجي - بانتظار التنفيذ في حالة الدفع الداخلي',
  },
  {
    id: 'pending_confirm_payment',
    label: 'بانتظار تأكيد الدفع',
  },
  {
    id: 'done',
    label: 'تم التنفيذ عميل / بانتظار تأكيد التنفيذ معلن',
  },
  {
    id: 'cancelled',
    label: 'تم الالغاء (في حالة لديه فاتورة)',
  },
  {
    id: 'confirm_rejected',
    label: 'تم رفض تأكيد التنفيذ',
  },
  {
    id: 'pending_confirm_stop_execution',
    label: 'بانتظار تأكيد ايقاف التنفيذ',
  },
  {
    id: 'finished',
    label: 'تم تأكيد التنفيذ',
  },
  {
    id: 'execution_stopped',
    label: 'تم تأكيد ايقاف التنفيذ',
  },
]
