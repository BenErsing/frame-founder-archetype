import { generateMetadata } from '@/lib/generate-page-metadata';
import { HomeComponent } from '@/components/HomeComponent';

export { generateMetadata as generateMetadata };

export default function Page() {
  return <HomeComponent />;
}
