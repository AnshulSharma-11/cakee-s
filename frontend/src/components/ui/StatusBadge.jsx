const styles = {
  APPROVED: 'bg-sage/15 text-sage',
  PENDING: 'bg-caramel/20 text-cocoa',
  REJECTED: 'bg-berry/15 text-berry-dark',
  PLACED: 'bg-caramel/20 text-cocoa',
  CONFIRMED: 'bg-caramel/20 text-cocoa',
  PREPARING: 'bg-caramel/20 text-cocoa',
  OUT_FOR_DELIVERY: 'bg-blush text-berry-dark',
  DELIVERED: 'bg-sage/15 text-sage',
  CANCELLED: 'bg-berry/15 text-berry-dark',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || 'bg-cream-deep text-cocoa-soft'}`}>
      {status}
    </span>
  )
}
