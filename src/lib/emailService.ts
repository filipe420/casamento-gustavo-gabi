export interface EmailConfig {
  emailServiceId: string;
  emailTemplateId: string;
  emailUserId: string;
  destinationEmail: string;
}

export interface RSVPData {
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  guestNames: string[];
}

export const getEmailConfig = (): EmailConfig | null => {
  const config = localStorage.getItem("weddingEmailConfig");
  return config ? JSON.parse(config) : null;
};

export const sendRSVPEmail = async (rsvpData: RSVPData): Promise<boolean> => {
  const config = getEmailConfig();

  if (!config || !config.destinationEmail) {
    console.warn("Email configuration not found");
    return false;
  }

  // Se não houver credenciais do EmailJS, pula o envio
  if (!config.emailServiceId || !config.emailTemplateId || !config.emailUserId) {
    console.warn("EmailJS credentials not configured, storing data locally");
    // Armazenar localmente como fallback
    storeRSVPLocally(rsvpData);
    return false;
  }

  try {
    // Importar dynamicamente o EmailJS
    let emailjs;
    try {
      emailjs = await import("@emailjs/browser");
    } catch {
      console.warn("EmailJS not installed, storing data locally");
      storeRSVPLocally(rsvpData);
      return false;
    }

    // Inicializar EmailJS com o User ID
    emailjs.init(config.emailUserId);

    // Preparar o template de email
    const templateParams = {
      to_email: config.destinationEmail,
      guest_name: rsvpData.name,
      guest_email: rsvpData.email,
      guest_phone: rsvpData.phone || "Não informado",
      attending: rsvpData.attending === "yes" ? "Sim ✅" : "Não ❌",
      num_guests: rsvpData.guests,
      guest_names: rsvpData.guestNames.length > 0 ? rsvpData.guestNames.join(", ") : "Nenhum acompanhante",
      confirmation_date: new Date().toLocaleDateString("pt-BR"),
      confirmation_time: new Date().toLocaleTimeString("pt-BR"),
    };

    // Enviar o email
    const response = await emailjs.send(
      config.emailServiceId,
      config.emailTemplateId,
      templateParams
    );

    if (response.status === 200) {
      storeRSVPLocally(rsvpData);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    // Fallback: armazenar localmente
    storeRSVPLocally(rsvpData);
    return false;
  }
};

// Função para armazenar RSVP localmente
const storeRSVPLocally = (rsvpData: RSVPData): void => {
  try {
    const allRSVPs = localStorage.getItem("weddingRSVPs");
    const rsvps = allRSVPs ? JSON.parse(allRSVPs) : [];
    
    rsvps.push({
      ...rsvpData,
      submittedAt: new Date().toISOString(),
    });
    
    localStorage.setItem("weddingRSVPs", JSON.stringify(rsvps));
  } catch (error) {
    console.error("Erro ao armazenar RSVP localmente:", error);
  }
};

// Função auxiliar para enviar email de teste
export const sendTestEmail = async (): Promise<boolean> => {
  const config = getEmailConfig();

  if (!config || !config.destinationEmail) {
    throw new Error("Email configuration not found");
  }

  if (!config.emailServiceId || !config.emailTemplateId || !config.emailUserId) {
    throw new Error("EmailJS credentials not configured");
  }

  try {
    const emailjs = await import("@emailjs/browser");
    emailjs.init(config.emailUserId);

    const templateParams = {
      to_email: config.destinationEmail,
      guest_name: "Teste de Configuração",
      guest_email: "teste@exemplo.com",
      guest_phone: "(11) 99999-9999",
      attending: "Sim ✅",
      num_guests: 2,
      guest_names: "João Silva, Maria Silva",
      confirmation_date: new Date().toLocaleDateString("pt-BR"),
      confirmation_time: new Date().toLocaleTimeString("pt-BR"),
    };

    const response = await emailjs.send(
      config.emailServiceId,
      config.emailTemplateId,
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error("Erro ao enviar email de teste:", error);
    throw error;
  }
};

// Função para recuperar todos os RSVPs armazenados localmente
export const getAllStoredRSVPs = (): (RSVPData & { submittedAt: string })[] => {
  try {
    const allRSVPs = localStorage.getItem("weddingRSVPs");
    return allRSVPs ? JSON.parse(allRSVPs) : [];
  } catch (error) {
    console.error("Erro ao recuperar RSVPs:", error);
    return [];
  }
};

// Função para exportar RSVPs em JSON (útil para backup)
export const exportRSVPsAsJSON = (): string => {
  const rsvps = getAllStoredRSVPs();
  return JSON.stringify(rsvps, null, 2);
};

