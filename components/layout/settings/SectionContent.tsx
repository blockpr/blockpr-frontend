import PerfilContent from "./PerfilContent"
import SeguridadContent from "./SeguridadContent"
import SubscripcionContent from "./SubscripcionContent"
import ConfiguracionContent from "./ConfiguracionContent"
import type { SettingsSection } from "./SettingsModal"

export default function SectionContent({ section }: { section: SettingsSection }) {
    switch (section) {
      case 'perfil': return <PerfilContent />
      case 'seguridad': return <SeguridadContent />
      case 'subscripcion': return <SubscripcionContent />
      case 'configuracion': return <ConfiguracionContent />
    }
  }