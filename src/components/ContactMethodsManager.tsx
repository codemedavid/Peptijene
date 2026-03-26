import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Save, Phone, Plus, X } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface ContactMethodsManagerProps {
  onBack: () => void;
}

// Helper to parse comma-separated string into array of non-empty strings
const parseList = (value: string): string[] => {
  if (!value) return [''];
  const items = value.split(',').map(s => s.trim()).filter(Boolean);
  return items.length > 0 ? items : [''];
};

// Helper to serialize array back to comma-separated string
const serializeList = (items: string[]): string => {
  return items.map(s => s.trim()).filter(Boolean).join(',');
};

const ContactMethodsManager: React.FC<ContactMethodsManagerProps> = ({ onBack }) => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();

  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappNumbers, setWhatsappNumbers] = useState<string[]>(['']);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramLinks, setTelegramLinks] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (siteSettings) {
      setWhatsappEnabled(siteSettings.contact_whatsapp_enabled === 'true');
      setWhatsappNumbers(parseList(siteSettings.contact_whatsapp_number || ''));
      setTelegramEnabled(siteSettings.contact_telegram_enabled === 'true');
      setTelegramLinks(parseList(siteSettings.contact_telegram_link || ''));
    }
  }, [siteSettings]);

  const updateWhatsappNumber = (index: number, value: string) => {
    const updated = [...whatsappNumbers];
    updated[index] = value;
    setWhatsappNumbers(updated);
  };

  const addWhatsappNumber = () => {
    setWhatsappNumbers([...whatsappNumbers, '']);
  };

  const removeWhatsappNumber = (index: number) => {
    if (whatsappNumbers.length <= 1) return;
    setWhatsappNumbers(whatsappNumbers.filter((_, i) => i !== index));
  };

  const updateTelegramLink = (index: number, value: string) => {
    const updated = [...telegramLinks];
    updated[index] = value;
    setTelegramLinks(updated);
  };

  const addTelegramLink = () => {
    setTelegramLinks([...telegramLinks, '']);
  };

  const removeTelegramLink = (index: number) => {
    if (telegramLinks.length <= 1) return;
    setTelegramLinks(telegramLinks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validWhatsappNumbers = whatsappNumbers.map(n => n.trim()).filter(Boolean);
    const validTelegramLinks = telegramLinks.map(l => l.trim()).filter(Boolean);

    // Validation
    if (whatsappEnabled && validWhatsappNumbers.length === 0) {
      alert('Please provide at least one WhatsApp number when WhatsApp is enabled.');
      return;
    }
    if (telegramEnabled && validTelegramLinks.length === 0) {
      alert('Please provide at least one Telegram username or link when Telegram is enabled.');
      return;
    }
    if (!whatsappEnabled && !telegramEnabled) {
      alert('At least one contact method must be enabled.');
      return;
    }

    try {
      setIsSaving(true);
      await updateSiteSettings({
        contact_whatsapp_enabled: String(whatsappEnabled),
        contact_whatsapp_number: serializeList(whatsappNumbers),
        contact_telegram_enabled: String(telegramEnabled),
        contact_telegram_link: serializeList(telegramLinks),
      });
      alert('Contact methods saved successfully!');
    } catch (error) {
      console.error('Error saving contact methods:', error);
      alert('Failed to save contact methods.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Methods</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure which contact methods appear during checkout.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* WhatsApp Section */}
            <div className={`rounded-xl border p-5 transition-all ${whatsappEnabled ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-gray-50/30'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${whatsappEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <svg className={`w-5 h-5 ${whatsappEnabled ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-xs text-gray-500">Enable WhatsApp as a contact method</p>
                  </div>
                </div>
                <button
                  onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${whatsappEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${whatsappEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              {whatsappEnabled && (
                <div className="mt-3 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    WhatsApp Numbers <span className="text-red-500">*</span>
                  </label>
                  {whatsappNumbers.map((number, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={number}
                        onChange={(e) => updateWhatsappNumber(index, e.target.value)}
                        placeholder="e.g. 639989747336"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow text-gray-900"
                      />
                      {whatsappNumbers.length > 1 && (
                        <button
                          onClick={() => removeWhatsappNumber(index)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove number"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addWhatsappNumber}
                    className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium mt-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add another number
                  </button>
                  <p className="text-xs text-gray-400">Enter each number with country code, without + or spaces.</p>
                </div>
              )}
            </div>

            {/* Telegram Section */}
            <div className={`rounded-xl border p-5 transition-all ${telegramEnabled ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-gray-50/30'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${telegramEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <svg className={`w-5 h-5 ${telegramEnabled ? 'text-blue-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Telegram</p>
                    <p className="text-xs text-gray-500">Enable Telegram as a contact method</p>
                  </div>
                </div>
                <button
                  onClick={() => setTelegramEnabled(!telegramEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${telegramEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${telegramEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              {telegramEnabled && (
                <div className="mt-3 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Telegram Usernames / Links <span className="text-red-500">*</span>
                  </label>
                  {telegramLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => updateTelegramLink(index, e.target.value)}
                        placeholder="e.g. @username or https://t.me/username"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-gray-900"
                      />
                      {telegramLinks.length > 1 && (
                        <button
                          onClick={() => removeTelegramLink(index)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove link"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addTelegramLink}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add another link
                  </button>
                  <p className="text-xs text-gray-400">Enter a @username or full t.me link.</p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 font-medium">
                At least one contact method must be enabled. Enabled methods will appear as options during checkout.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Contact Methods'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMethodsManager;
