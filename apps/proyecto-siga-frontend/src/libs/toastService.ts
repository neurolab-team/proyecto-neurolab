import { toast } from 'react-hot-toast';

export const notify = {
  error: (msg: string) => toast.error(msg, { duration: 4000 }),
  success: (msg: string) => toast.success(msg),
  loading: (msg: string) => toast.loading(msg),
};
