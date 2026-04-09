import { useState, useEffect, useCallback } from 'react';
import { guideApi } from '../api';

const DIAGRAM_MAP = {
  'Dwight D. Eisentower':  'dwight-d-eisentower',
  'Copterium Starter':     'copterium-starter',
  'Steelworks Starter':    'steelworks-starter',
  'Steelworks Endgame':    'steelworks-endgame',
  'General Motors Starter':'general-motors-starter',
  'Oil of Olaz Starter':   'oil-of-olaz-starter',
  'Copterium City Final':  'copterium-city-final',
  'General Motors Final':  'general-motors-final',
  'HeavyRames Endgame':    'heavyrames-endgame',
  'Oil of Olaz Final':     'oil-of-olaz-final',
  'Kwartz Endgame':        'kwartz-endgame',
  'Maxi IBM':              'maxi-ibm',
  'ALU Starter':           'alu-starter',
  'Alu Area 3':            'alu-area-3',
  'Cool Runnings':         'cool-runnings',
  'TurboSuper':            'turbosuper',
  'SpaceParts Endgame':    'spaceparts-endgame',
  'Quanto':                'quanto',
  'SpaceFarts':            'spacefarts',
};

const FOLGE_EMOJI = {
  1: '🟢', 2: '🟢', 3: '🟡', 4: '🟡', 5: '🔴', 6: '🔴', 7: '⚫'
};

const TIP_CONFIG = {
  einsteiger: { emoji: '💡', label: 'Einsteiger-Tipp', color: 'bg-green-900/20 border-green-800/30 text-green-300' },
  pro:        { emoji: '⭐', label: 'Pro-Tipp', color: 'bg-yellow-900/20 border-yellow-800/30 text-yellow-300' },
  spass:      { emoji: '🎮', label: 'Spaß-Empfehlung', color: 'bg-blue-900/20 border-blue-800/30 text-blue-300' },
  server:     { emoji: '⚠️', label: 'Server-Hinweis', color: 'bg-orange-900/20 border-orange-800/30 text-orange-300' },
};

// Which tip types each experience level can see
function getVisibleTipTypes(level) {
  if (level === 'veteran') return ['pro', 'spass', 'server'];
  return ['einsteiger', 'pro', 'spass', 'server']; // neuling & kenner see all
}

const TIP_FILTER_OPTIONS = [
  { value: 'all', label: 'Alle' },
  { value: 'einsteiger', label: '💡 Einsteiger' },
  { value: 'pro', label: '⭐ Profis' },
  { value: 'spass', label: '🎮 Extras' },
  { value: 'server', label: '⚠️ Server' },
];

export default function Guide({ player }) {
  const [phases, setPhases] = useState([]);
  const [selectedFolge, setSelectedFolge] = useState(null);
  const [expandedProd, setExpandedProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipFilter, setTipFilter] = useState('all');

  useEffect(() => {
    guideApi.getPhases().then(data => {
      setPhases(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-400 animate-pulse">Leitfaden wird geladen...</div>;
  }

  const selectedPhase = phases.find(p => p.folge_number === selectedFolge);
  const visibleTypes = getVisibleTipTypes(player.experience_level);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Leitfaden</h2>
          <p className="text-gray-400 text-sm">Basierend auf Tschukis Masterclass 1.0</p>
        </div>

        {/* Tip Filter */}
        <div className="flex items-center gap-1.5 bg-surface rounded-lg p-1">
          {TIP_FILTER_OPTIONS
            .filter(opt => opt.value === 'all' || visibleTypes.includes(opt.value))
            .map(opt => (
            <button
              key={opt.value}
              onClick={() => setTipFilter(tipFilter === opt.value ? 'all' : opt.value)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                tipFilter === opt.value
                  ? 'bg-satisfactory text-black'
                  : 'text-gray-400 hover:text-white hover:bg-surface-lighter'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Episode Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-6">
        {phases.map(phase => (
          <button
            key={phase.id}
            onClick={() => {
              setSelectedFolge(selectedFolge === phase.folge_number ? null : phase.folge_number);
              setExpandedProd(null);
            }}
            className={`rounded-xl p-3 text-left transition-all border ${
              selectedFolge === phase.folge_number
                ? 'border-satisfactory bg-satisfactory/10'
                : 'border-surface-lighter bg-surface hover:bg-surface-light'
            }`}
          >
            <div className="text-lg mb-1">{FOLGE_EMOJI[phase.folge_number]}</div>
            <div className="text-xs text-gray-400">Folge {phase.folge_number}</div>
            <div className="text-sm font-medium text-white truncate">{phase.title}</div>
            <div className="text-xs text-gray-500 mt-1">{phase.tier_requirement}</div>
          </button>
        ))}
      </div>

      {/* Selected Phase Detail */}
      {selectedPhase && (
        <PhaseDetail
          phase={selectedPhase}
          expandedProd={expandedProd}
          setExpandedProd={setExpandedProd}
          player={player}
          tipFilter={tipFilter}
          visibleTypes={visibleTypes}
        />
      )}

      {/* Overview when nothing selected */}
      {!selectedPhase && (
        <div className="space-y-3">
          {phases.map(phase => (
            <button
              key={phase.id}
              onClick={() => { setSelectedFolge(phase.folge_number); setExpandedProd(null); }}
              className="w-full bg-surface rounded-xl p-4 text-left hover:bg-surface-light transition-colors flex items-center gap-4"
            >
              <span className="text-2xl">{FOLGE_EMOJI[phase.folge_number]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Folge {phase.folge_number} – {phase.title}</span>
                  <span className="text-xs text-gray-500 bg-surface-lighter px-2 py-0.5 rounded">
                    {phase.tier_requirement}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {phase.productions.length} Produktion{phase.productions.length !== 1 ? 'en' : ''}
                  {phase.productions.some(p => p.power_original_mw) && (
                    <span className="ml-2">
                      ⚡ ~{phase.productions.reduce((sum, p) => sum + (p.power_original_mw || 0), 0).toLocaleString('de-DE')} MW
                    </span>
                  )}
                </div>
              </div>
              <span className="text-gray-500 text-xl">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PhaseDetail({ phase, expandedProd, setExpandedProd, player, tipFilter, visibleTypes }) {
  const totalPower = phase.productions.reduce((sum, p) => sum + (p.power_original_mw || 0), 0);

  return (
    <div>
      {/* Phase Header */}
      <div className="bg-surface rounded-xl p-5 mb-4" style={{ borderLeft: `4px solid ${phase.color}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{FOLGE_EMOJI[phase.folge_number]}</span>
          <h3 className="text-xl font-bold text-white">
            Folge {phase.folge_number} – {phase.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-surface-lighter px-2 py-1 rounded text-gray-300">
            🔬 {phase.tier_requirement}
          </span>
          {totalPower > 0 && (
            <span className="bg-surface-lighter px-2 py-1 rounded text-gray-300">
              ⚡ ~{totalPower.toLocaleString('de-DE')} MW
            </span>
          )}
          <span className="bg-surface-lighter px-2 py-1 rounded text-gray-300">
            🏗️ {phase.productions.length} Produktion{phase.productions.length !== 1 ? 'en' : ''}
          </span>
        </div>
        {phase.youtube_url && (
          <a
            href={phase.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm text-satisfactory hover:text-satisfactory-dark transition-colors"
          >
            ▶ Tschukis Video ansehen
          </a>
        )}
      </div>

      {/* Productions List */}
      <div className="space-y-3">
        {phase.productions.map(prod => (
          <ProductionCard
            key={prod.id}
            production={prod}
            expanded={expandedProd === prod.id}
            onToggle={() => setExpandedProd(expandedProd === prod.id ? null : prod.id)}
            tipFilter={tipFilter}
            visibleTypes={visibleTypes}
          />
        ))}
      </div>
    </div>
  );
}

function DiagramLightbox({ name, onClose }) {
  const slug = DIAGRAM_MAP[name];
  const src = `/production-diagrams/${slug}.png`;

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <div
        className="relative max-w-[95vw] max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-white font-semibold text-sm">{name} – Produktionsdiagramm</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none ml-6"
          >
            ×
          </button>
        </div>
        <img
          src={src}
          alt={`Produktionsdiagramm ${name}`}
          className="rounded-xl object-contain max-w-[95vw] max-h-[85vh] bg-[#1e2a35]"
        />
      </div>
    </div>
  );
}

function ProductionCard({ production, expanded, onToggle, tipFilter, visibleTypes }) {
  const prod = production;
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);
  const [diagramOpen, setDiagramOpen] = useState(false);
  const hasDiagram = !!DIAGRAM_MAP[prod.name];

  // Filter tips: first by player level visibility, then by selected filter
  const filteredTips = (prod.tips || []).filter(tip => {
    if (!visibleTypes.includes(tip.type)) return false;
    if (tipFilter !== 'all' && tip.type !== tipFilter) return false;
    return true;
  });

  const tipCount = filteredTips.length;

  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      {diagramOpen && <DiagramLightbox name={prod.name} onClose={() => setDiagramOpen(false)} />}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-surface-light transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{prod.name}</span>
            {prod.somersloops_needed > 0 && (
              <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">
                🔮 Somersloops
              </span>
            )}
            {prod.machines && (
              <span className="text-xs bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded">
                🏭 {prod.machines.steps.length} Schritte
              </span>
            )}
            {tipCount > 0 && (
              <span className="text-xs bg-surface-lighter text-gray-400 px-2 py-0.5 rounded">
                💬 {tipCount} Tipp{tipCount !== 1 ? 's' : ''}
              </span>
            )}
            {hasDiagram && (
              <span className="text-xs bg-teal-900/40 text-teal-400 px-2 py-0.5 rounded">
                📊 Diagramm
              </span>
            )}
          </div>
          {prod.power_original_mw && (
            <span className="text-sm text-gray-400">⚡ ~{prod.power_original_mw.toLocaleString('de-DE')} MW</span>
          )}
        </div>
        <span className={`text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}>›</span>
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-4 border-t border-surface-lighter pt-4">
          {/* Bedarfsliste */}
          {prod.requirements && (
            <div className="bg-surface-light rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-satisfactory uppercase tracking-wide">
                📋 Bedarfsliste – Was brauchst du vorher?
              </h4>

              {prod.requirements.research?.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1.5">🔬 Forschung / Tier</div>
                  <div className="space-y-1">
                    {prod.requirements.research.map((r, i) => (
                      <div key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-gray-600 mt-0.5">•</span> {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {prod.requirements.resources?.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1.5">⛏️ Rohstoffe</div>
                  <div className="space-y-1.5">
                    {prod.requirements.resources.map((r, i) => (
                      <div key={i} className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-600 mt-0.5">•</span>
                          <div>
                            <span className="text-sm text-white">{r.item}</span>
                            {r.note && <div className="text-xs text-gray-500 mt-0.5">{r.note}</div>}
                          </div>
                        </div>
                        {r.rate && (
                          <span className="text-xs font-medium text-blue-400 shrink-0">{r.rate}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {prod.requirements.productions?.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1.5">🏗️ Laufende Produktionen</div>
                  <div className="space-y-1.5">
                    {prod.requirements.productions.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-gray-600 mt-0.5">•</span>
                        <div>
                          <span className="text-sm text-white">{p.name}</span>
                          <div className="text-xs text-gray-500 mt-0.5">{p.reason}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {prod.power_original_mw && (
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1.5">⚡ Benötigter Strom</div>
                  <span className="text-sm text-red-400 font-medium">~{prod.power_original_mw.toLocaleString('de-DE')} MW</span>
                </div>
              )}

              {prod.requirements.note && (
                <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-2.5">
                  <p className="text-xs text-orange-300">{prod.requirements.note}</p>
                </div>
              )}
            </div>
          )}

          {/* Diagram Button */}
          {hasDiagram && (
            <button
              onClick={() => setDiagramOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-teal-900/20 border border-teal-800/30 hover:bg-teal-900/40 text-teal-300 rounded-xl py-3 text-sm font-medium transition-colors"
            >
              📊 Produktionsdiagramm anzeigen
            </button>
          )}

          {/* Prerequisites */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Voraussetzungen
            </h4>
            <p className="text-sm text-gray-300">{prod.prerequisites_text}</p>
          </div>

          {/* Produktionsplan (Tschuki Masterclass) */}
          {prod.machines && (
            <div>
              <button
                onClick={() => setPlanExpanded(!planExpanded)}
                className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wide hover:text-blue-300 transition-colors w-full text-left"
              >
                <span className={`transition-transform ${planExpanded ? 'rotate-90' : ''}`}>›</span>
                🏭 Produktionsplan (Tschuki Masterclass)
                <span className="text-gray-600 font-normal normal-case ml-1">
                  {prod.machines.steps.length} Produktionsschritte
                </span>
              </button>

              {planExpanded && (
                <div className="mt-3 space-y-3">
                  {/* Rohstoffe */}
                  <div className="bg-surface-light rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase mb-2">⛏️ Rohstoff-Input</div>
                    <div className="flex flex-wrap gap-2">
                      {prod.machines.raw_inputs.map((inp, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-surface rounded-lg px-3 py-1.5">
                          <span className="text-sm text-white">{inp.item}</span>
                          <span className="text-xs font-bold text-blue-400">{inp.rate}/min</span>
                          {inp.note && <span className="text-xs text-gray-500 italic">({inp.note})</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Maschinenschritte */}
                  <div className="space-y-2">
                    {prod.machines.steps.map((step, i) => (
                      <div key={i} className="bg-surface-light rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className={`px-4 py-2.5 flex items-center gap-3 ${step.is_alternate ? 'bg-yellow-900/20' : ''}`}>
                          <div className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                            step.machine === 'Schmelzofen'   ? 'bg-orange-900/50 text-orange-300' :
                            step.machine === 'Gießerei'      ? 'bg-red-900/50 text-red-300' :
                            step.machine === 'Konstruktor'   ? 'bg-green-900/50 text-green-300' :
                            step.machine === 'Monteur'       ? 'bg-blue-900/50 text-blue-300' :
                            step.machine === 'Raffinerie'    ? 'bg-purple-900/50 text-purple-300' :
                            step.machine === 'Manufaktor'    ? 'bg-cyan-900/50 text-cyan-300' :
                                                              'bg-surface-lighter text-gray-300'
                          }`}>
                            {step.count_display}×
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-white">{step.machine}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              {step.is_alternate && <span className="text-yellow-500">ALT: </span>}
                              {step.recipe}
                            </span>
                          </div>
                        </div>
                        {/* I/O */}
                        <div className="px-4 pb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {step.inputs.map((inp, j) => (
                              <span key={j} className="text-gray-400">
                                {inp.item} <span className="text-blue-400 font-medium">{inp.rate}/min</span>
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-600">→</span>
                          <div className="flex flex-wrap gap-1.5">
                            {step.outputs.map((out, j) => (
                              <span key={j} className="text-gray-300">
                                {out.item} <span className="text-satisfactory font-medium">{out.rate}/min</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Outputs */}
                  <div className="bg-surface-light rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase mb-2">📦 Output dieser Produktion</div>
                    <div className="flex flex-wrap gap-2">
                      {prod.machines.final_outputs.map((out, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-surface rounded-lg px-3 py-1.5">
                          <span className="text-sm text-white">{out.item}</span>
                          <span className="text-xs font-bold text-satisfactory">{out.rate}/min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Outputs */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Produktion / Output
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {prod.outputs.map((output, i) => (
                <div key={i} className="bg-surface-light rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-sm text-white">{output.item}</span>
                  {output.rate && (
                    <span className="text-xs text-satisfactory font-medium">{output.rate}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Forwards To */}
          {prod.forwards_to.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Weiterleitung an
              </h4>
              <div className="flex flex-wrap gap-2">
                {prod.forwards_to.map((target, i) => (
                  <span key={i} className="text-sm bg-surface-lighter text-gray-300 px-3 py-1 rounded-lg">
                    → {target}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Somersloops */}
          {prod.somersloops_needed > 0 && (
            <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3">
              <span className="text-sm text-purple-300">
                🔮 Diese Produktion benötigt Somersloops für volle Effizienz
              </span>
            </div>
          )}

          {/* Tips Section */}
          {tipCount > 0 && (
            <div>
              <button
                onClick={() => setTipsExpanded(!tipsExpanded)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:text-gray-200 transition-colors"
              >
                <span className={`transition-transform ${tipsExpanded ? 'rotate-90' : ''}`}>›</span>
                💬 {tipCount} Tipp{tipCount !== 1 ? 's' : ''} anzeigen
              </button>

              {tipsExpanded && (
                <div className="mt-2 space-y-2">
                  {filteredTips.map(tip => {
                    const config = TIP_CONFIG[tip.type];
                    return (
                      <div key={tip.id} className={`rounded-lg border p-3 ${config.color}`}>
                        <div className="flex items-start gap-2">
                          <span className="text-sm shrink-0">{config.emoji}</span>
                          <div>
                            <span className="text-xs font-semibold opacity-70">{config.label}</span>
                            <p className="text-sm mt-0.5">{tip.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
