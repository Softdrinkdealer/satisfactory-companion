🏭 Satisfactory Companion – Konzeptdokument
Erstellt als Grundlage für die Entwicklung mit Claude Code
﻿
1. Projektübersicht
Ziel: Eine Web-App die Patrick, Nico und Marie beim gemeinsamen Satisfactory-Durchspielen unterstützt. Sie kombiniert einen interaktiven Leitfaden (basierend auf Tschukis Masterclass), ein Aufgabensystem und nützliche Tools – alles abgestimmt auf die Serverkonfiguration der Gruppe.
Hosting: Selbst gehosteter Homeserver (gleicher Server wie der Satisfactory Dedicated Server) Zielgruppe: Vorerst nur die drei Spieler (privat), spätere Veröffentlichung möglich Spielversion: Satisfactory 1.2 Experimental
﻿
2. Serverkonfiguration (wird in der App berücksichtigt)
Einstellung
Wert
Stromkosten
50% (alle MW-Angaben halbiert)
Ressourcen-Reinheit
Größtenteils Rein
Node-Generierung
Zufällig
﻿
3. Spielerprofile
Spieler
Name
Erfahrungsgrad (Standard)
Patrick
Veteran 🔴
Nico
Kenner 🟡
Marie
Neuling 🟢
Erfahrungsgrade
Neuling 🟢 – Spielt Satisfactory zum ersten Mal
Kenner 🟡 – Hat schon gespielt, aber nie sehr weit
Veteran 🔴 – Kennt sich aus, braucht keine Grundlagen
Der Erfahrungsgrad ist jederzeit in den Profileinstellungen änderbar.
Was der Grad beeinflusst
Tipp-Typ
🟢 Neuling
🟡 Kenner
🔴 Veteran
💡 Einsteiger-Tipp
✅
✅
❌
⭐ Pro-Tipp
✅
✅
✅
🎮 Spaß-Empfehlung
✅
✅
✅
⚠️ Server-Hinweis
✅
✅
✅
Wichtig: Der Erfahrungsgrad filtert nur Tipps – nicht welche Aufgaben ein Spieler übernehmen kann.
﻿
4. Haupt-Features
4.1 📋 Leitfaden
Herzstück der App. Aufgebaut nach den Folgen der Tschuki Masterclass (1.0). Jede Folge enthält mehrere Produktionen mit:
Voraussetzungen-Checkliste (Tier-Level, Alternativrezepte, laufende Produktionen)
Bedarfsliste – Was brauche ich VOR dem Bau?
🔬 Forschung / Tier-Level
🏗️ Laufende Produktionen die Input liefern (mit Mengenangabe)
⚡ Benötigter Strom (bereits mit 50% berechnet)
Output-Übersicht – Was wird produziert? Was wird weitergeleitet wohin?
Tipps – gefiltert nach Erfahrungsgrad, standardmäßig eingeklappt
„Patrick kann das erklären"-Hinweis bei komplexen Schritten
Weiterleitung zu Tschukis YouTube-Video der jeweiligen Folge
Tipp-Filter (oben auf der Leitfaden-Seite)
Zeige Tipps für: [ Alle ] [ Einsteiger ] [ Profis ] [ Extras ]
Tipp-Typen
💡 Einsteiger-Tipp – Erklärt das „Warum" hinter einer Aktion (für Marie)
⭐ Pro-Tipp – Effizienz- und Strategie-Hinweise (für Nico & Patrick)
🎮 Spaß-Empfehlung – Extras die nicht in der Masterclass sind, aber Spaß machen
⚠️ Server-Hinweis – Spezifisch für eure Konfiguration (50% Strom etc.)
﻿
4.2 Vollständige Leitfaden-Struktur (Tschuki Masterclass 1.0)
🟢 Folge 1 – Eisen-Grundlage (Tier 2)
Dwight D. Eisentower | ~218 MW (50%) | Rotoren, Verstärkte Eisenplatten, Modulare Rahmen, Int. Beschichtung
🟢 Folge 2 – Kupfer & Stahl (Tier 3–4)
Copterium Starter | ~39 MW | KI-Begrenzer, Turbodraht, Kabel
Steelworks Starter | ~26 MW | Stahlrohr, Stahlträger
Steelworks Endgame | ~325 MW | Stator, Mehrzweckgerüst, Automatische Verkabelung
🟡 Folge 3 – Motoren & Öl (Tier 4–5)
General Motors Starter | ~139 MW | 10x Motor/min
Oil of Olaz Starter | ~146 MW | Kunststoff, Gummi, Petrolkoks
Copterium City Final | ~208 MW | KI-Begrenzer, Turbodraht, Kupferblech
General Motors Final | ~486 MW | Modularer Motor, Motor
🟡 Folge 4 – Schwere Teile & Quarz (Tier 6)
HeavyRames Endgame | ~336 MW | Schwerer Modularer Rahmen (Somersloops!)
Oil of Olaz Final | ~597 MW | Treibstoff, Gummi, Gewebe, Petrolkoks
Kwartz Endgame | ~466 MW | Quarzoszillator, Quarzsand
🔴 Folge 5 – Computer & Aluminium (Tier 6–7)
Maxi IBM | Computer, Adaptive Steuereinheit (Somersloops!)
ALU Starter | Aluminiumprodukte
Alu Area 3 | Funksteuereinheit, Alclad-Platten
Cool Runnings | Kühlsysteme, Verschmolzener Modularer Rahmen
🔴 Folge 6 – Supercomputer & Turbomotoren (Tier 7–8)
TurboSuper | ~162 MW | Turbomotor, Supercomputer (Somersloops!)
⚫ Folge 7 – Endgame (Tier 8–9)
SpaceParts Endgame | ~43.700 MW | Thermaler Raketenantrieb, Montage-Leitsystem, Magnetfeld-Generator
Quanto | ~48.817 MW | Neural-Quantenprozessor, Singularitätszelle, Dunkle-Materie-Produkte
SpaceFarts | ~1.340 MW | Rückführung Dunkle-Materie-Überrest → Quanto
﻿
4.3 👥 Aufgabenverwaltung
Aufgaben-Quellen
Leitfaden-Aufgaben – automatisch aus Produktionsschritten generiert
Freie Aufgaben – manuell von jedem Spieler erstellt
Aufgaben-Kategorien
Kategorie
Beispiele
🏗️ Bauen
Produktion aufbauen, Förderbänder verlegen
🔬 Forschen
MAM-Forschung, Festplatten analysieren, Tier freischalten
🗺️ Erkunden
Nodes finden, Ressourcen eintragen, neue Gebiete erschließen
⚡ Versorgen
Strom ausbauen, Kraftwerke bauen, Engpässe beheben
Aufgaben-Status
🟢 Offen → 🔄 In Arbeit → ✅ Fertig
Aufgaben verschieben
Jede Aufgabe kann jederzeit an einen anderen Spieler weitergegeben werden – mit optionalem Grund:
„Zu komplex"
„Keine Zeit"
„Kein Bock" 😄
Freitext
Sichtbarkeit
Jeder Spieler sieht seine eigenen Aufgaben hervorgehoben, kann aber alle Aufgaben aller Spieler einsehen.
Aktivitäts-Log
Kurze Timeline der letzten Aktionen: „Nico hat vor 2h Steelworks Starter als fertig markiert"
﻿
4.4 🔧 Tools
Produktionsrechner (eigenständig, kein externer Link)
Eingabe: Gewünschtes Item + Menge pro Minute
Ausgabe:
Benötigte Maschinen (Anzahl)
Benötigte Rohstoffe (Input/min)
Stromverbrauch mit 50%-Faktor bereits eingerechnet
Welche Alternativrezepte helfen
Rezept-Nachschlagewerk
Alle Satisfactory-Rezepte durchsuchbar
Alternativrezepte deutlich markiert
Stromwerte mit 50% angepasst
Hinweis welcher Folge das Rezept zugeordnet ist
Node-Entdeckungs-Log
Da Nodes zufällig generiert: Gemeinsame Notizliste
Eintragen: Ressourcentyp, Reinheit, grobe Beschreibung des Orts
Für alle Spieler sichtbar und editierbar
Optional: Anbindung an Satisfactory Dedicated Server REST-API (http://server:7777/api/v1) für automatisches Auslesen der Node-Positionen wenn der Server läuft
Strom-Tracker
Eingetragene laufende Produktionen → Summe des Stromverbrauchs (50%)
Eintragen der aktuellen Stromproduktion
Einfache Anzeige: Verbrauch vs. Produktion vs. Puffer
Alternativrezept-Tracker
Pro Schritt: Welche Alternativrezepte sind nötig?
Abhakbar: „Haben wir bereits"
Hinweis zur Fundmethode: Festplatte (HDD) oder MAM-Forschung
Somersloop-Planer
Übersicht welche Produktionen wie viele Somersloops benötigen
Gesamtbedarf auf einen Blick
Server-Status-Widget
Zeigt ob der Dedicated Server gerade online ist (Ping auf die REST-API)
﻿
4.5 🎮 „Nicht notwendig aber cool"-Sektion
Extras die nicht in der Masterclass sind, aber das Spiel bereichern:
Feature
Empfohlener Zeitpunkt
Warum
🚁 Jetpack
Tier 2 – Feldforschung (MAM)
Unverzichtbar für Erkundung
⛽ Flüssiger Treibstoff
Vor/nach Folge 3
Effizienter als Kohle-Kraftwerke
🚂 Züge
Ab Tier 6
Beste Logistiklösung für lange Distanzen
🌿 AWESOME Sink
Sobald gebaut
Überschuss-Items in Punkte umwandeln
🏎️ Explorer / Fahrzeuge
Früh
Ressourcen-Erkundung, Spaßfaktor
💡 Power Augmenter
Spätmittel-/Endgame
Freie Energie durch Mercer Spheres
﻿
4.6 🛡️ Engpass-Checkliste
Schnelle Hilfe wenn eine Produktion nicht läuft – besonders nützlich für Marie:

Strom angeschlossen und ausreichend?

Input-Material vorhanden und fließend?

Förderband-Kapazität ausreichend (Mk. ausreichend)?

Maschine nicht im Standby-Modus?

Pipeline-Verbindung korrekt (bei Flüssigkeiten)?

Splitter/Merger korrekt konfiguriert?
﻿
5. Tech-Stack
Bereich
Technologie
Begründung
Frontend
React + Vite
Modern, schnell, große Community
Styling
Tailwind CSS
Schnell zu schreiben, gutes Dark Mode
Backend
Node.js + Express
Einfach, JSON-freundlich
Datenbank
SQLite
Kein Overhead, läuft lokal, reicht völlig
Echtzeit
WebSockets (optional)
Für Live-Fortschritt der Aufgaben
Hosting
Docker-Container auf Homeserver
Sauber, isoliert, einfach zu starten
﻿
6. Datenbankschema (Grundstruktur)
Tabelle: players
id, name, experience_level (neuling/kenner/veteran), created_at, last_active
Tabelle: guide_phases
id, folge_number, title, tier_requirement, youtube_url
Tabelle: productions
id, phase_id, name, power_original_mw, power_adjusted_mw (50%),
prerequisites_text, outputs_json, forwards_to_json, somersloops_needed
Tabelle: tips
id, production_id, text, type (einsteiger/pro/spass/server),
min_level (neuling/kenner/veteran)
Tabelle: tasks
id, title, category (bauen/forschen/erkunden/versorgen),
source (leitfaden/manuell), production_id (nullable),
assigned_to_player_id, status (offen/in_arbeit/fertig),
created_by_player_id, created_at, updated_at, handover_reason
Tabelle: activity_log
id, player_id, action_text, created_at
Tabelle: nodes
id, resource_type, purity (rein/normal/unrein),
location_description, discovered_by_player_id, created_at
Tabelle: power_tracker
id, production_name, power_consumption_mw, is_active, updated_at
Tabelle: recipes_unlocked
id, recipe_name, production_id, is_unlocked, unlock_method (hdd/mam)
﻿
7. Design
Stil: Dunkel, industriell – passend zum Satisfactory-Feeling
Akzentfarbe: Orange (#F7931A ähnlich Satisfactory-Orange)
Schrift: Klar, gut lesbar auch bei längeren Texten
Mobil-optimiert: Ja – Spieler nutzen ggf. Handy neben dem PC
Dark Mode: Standard (kein Light Mode nötig)
﻿
8. Nicht einbauen (Scope-Begrenzung)
❌ Automatische Kartendarstellung (zu komplex für zufällige Nodes)
❌ Echtzeit-Fabrik-Monitoring via API (Overkill für private Gruppe)
❌ Blueprint-Editor in der App (besser direkt im Spiel)
❌ Account-System mit Passwörtern (lokales Netz, nicht nötig)
﻿
9. Entwicklungs-Prioritäten (Reihenfolge für Claude Code)
Spielerprofile – Anlegen, Erfahrungsgrad setzen/ändern, Spieler auswählen
Leitfaden Grundstruktur – Folgen, Produktionen, Voraussetzungen, Bedarfslisten
Tipp-System – Typen, Level-Filterung, Aufklapp-Funktion
Aufgabenverwaltung – Erstellen, Zuweisen, Status, Weitergeben
Aktivitäts-Log – Was hat wer wann gemacht
Strom-Tracker – Verbrauch vs. Produktion
Rezept-Nachschlagewerk – Alle Rezepte, suchbar
Produktionsrechner – Eigenständig mit 50%-Faktor
Node-Log – Manuelle Einträge
Alternativrezept-Tracker – Pro Produktion, abhakbar
Somersloop-Planer – Gesamtübersicht
Server-Status-Widget – Online/Offline Ping
„Cool aber nicht nötig"-Sektion – Extras mit Tipps
Server-API-Anbindung – Node-Daten automatisch auslesen (optional, später)
﻿
10. Spieler-Info Zusammenfassung
﻿
Patrick
Nico
Marie
Erfahrung
Veteran 🔴
Kenner 🟡
Neuling 🟢
Tipps
Pro + Extras
Einsteiger + Pro + Extras
Alle
Rolle
Erklärer / Experte
Mittelspieler
Entdeckerin
﻿
Dokument erstellt nach gemeinsamer Konzeptphase – bereit für Claude Code 🚀