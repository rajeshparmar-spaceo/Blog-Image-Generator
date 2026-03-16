import { useFontLoader } from './hooks/useFontLoader';
import { useLogoPreloader } from './hooks/useLogoPreloader';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  useFontLoader();
  useLogoPreloader();

  return <AppShell />;
}
