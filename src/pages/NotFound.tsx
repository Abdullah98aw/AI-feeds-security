import { ErrorFallback } from '../components/ErrorFallback';

export default function NotFound() {
  return (
    <ErrorFallback
      title="404 Page Not Found"
      message="The requested prototype page does not exist."
      detail="You can return to the dashboard, open the findings queue, or go back to the previous page."
    />
  );
}
