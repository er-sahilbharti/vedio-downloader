import { ArrowRight, CheckCircle2, Download, ShieldCheck, Smartphone, TimerReset, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UrlInput from '../components/UrlInput';

const features = [
  { icon: TimerReset, title: 'Fast Processing', text: 'Quick URL validation and metadata lookup.' },
  { icon: Download, title: 'Multiple Formats', text: 'Choose between supported authorized formats and qualities.' },
  { icon: Smartphone, title: 'Mobile Friendly', text: 'Responsive access across mobile and desktop devices.' },
  { icon: ShieldCheck, title: 'Secure Processing', text: 'Safe handling and temporary file cleanup.' },
  { icon: Wand2, title: 'Download History', text: 'Keep track of prior downloads and manage records.' },
];

const steps = [
  'Paste URL',
  'Choose format',
  'Download',
];

export default function Home() {
  const navigate = useNavigate();

  const handleSubmit = (url) => {
    navigate('/download', { state: { url } });
  };

  return (
    <div>
      <section className="page-shell pb-8 pt-10">
        <div className="gradient-panel card overflow-hidden p-6 sm:p-8 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                Authorized downloads
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Download Your Authorized Videos
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-600">
                Fast, simple and secure video downloading for content you are permitted to download.
              </p>

              <div className="mt-7 max-w-3xl">
                <UrlInput onSubmit={handleSubmit} />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-white px-3 py-1.5 font-medium shadow-sm">Supported sources: direct media URLs</span>
                <span className="rounded-full bg-white px-3 py-1.5 font-medium shadow-sm">Secure processing</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
                <div className="rounded-[22px] bg-slate-900 p-4 text-white">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-400" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400" />
                      <span className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs text-slate-300">Quick Access</span>
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="mb-4 h-40 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-3">
                      <div className="flex h-full items-end justify-between rounded-lg border border-white/20 bg-black/10 p-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Preview</p>
                          <p className="mt-2 text-lg font-semibold">Authorized media</p>
                        </div>
                        <div className="rounded-full bg-white/20 p-2">
                          <Download className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-slate-200">
                      <div className="flex items-center justify-between rounded-lg bg-slate-700 px-3 py-2">
                        <span>Format</span>
                        <span className="font-medium">MP4</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-700 px-3 py-2">
                        <span>Quality</span>
                        <span className="font-medium">1080p</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell pt-0">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Built for speed and control</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {features.map((feature) => (
            <div key={feature.title} className="card p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="card relative p-6 text-center">
              <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                {index + 1}
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-semibold text-slate-900">{step}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {index === 0 && 'Paste the authorized URL you want to review.'}
                  {index === 1 && 'Choose an available format and quality.'}
                  {index === 2 && 'Download the file once the job is complete.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell pb-8">
        <div className="card flex flex-col items-center justify-between gap-4 p-6 text-center md:flex-row md:text-left">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Ready to start?</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Download only what you are authorized to access.</h3>
          </div>
          <button type="button" className="btn-primary" onClick={() => navigate('/download')}>
            Continue <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
