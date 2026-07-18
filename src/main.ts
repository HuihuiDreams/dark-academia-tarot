import './styles.css';
import { TarotWidget } from './components/TarotWidget';

window.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.querySelector<HTMLDivElement>('#app');
  if (appContainer) {
    new TarotWidget(appContainer);
  }
});
