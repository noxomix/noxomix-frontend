# Frontend Design System & Conventions

## Design Philosophy
Das Frontend folgt einem minimalistischen, modernen Design mit klaren Linien und einheitlicher Farbgebung. Der Fokus liegt auf Benutzerfreundlichkeit und einer konsistenten User Experience.

## Color System & Branding

### Primary Colors
- **Primary**: `blue-500` (#3B82F6) - für Hauptaktionen und wichtige UI-Elemente
- **Secondary**: `gray-300` (#D1D5DB) - für sekundäre Buttons und Borders
- **Slate**: `slate-700` (#334155) - für wichtige Aktionen wie "Add User", "Add Domain"

### Status Colors
- **Success**: `green-500` (#10B981) - für Erfolg und "enabled" Status
- **Danger**: `red-500` (#EF4444) - für Löschaktionen und "disabled" Status  
- **Warning**: `yellow-500` (#F59E0B) - für Warnungen und Admin-Rollen
- **Info**: `blue-500` (#3B82F6) - für Informationen und Customer-Rollen

### Semantic Usage
- Admin-Rolle: `bg-yellow-100 text-yellow-800`
- Customer-Rolle: `bg-blue-100 text-blue-800`
- Enabled Status: `bg-green-100 text-green-800`
- Disabled Status: `bg-red-100 text-red-800`

## Layout & Spacing

### Container Structure
```vue
<div class="p-8 max-w-6xl mx-auto md:p-4">
  <!-- Main content container -->
</div>
```

### Page Headers
```vue
<h2 class="flex items-center gap-2 mb-8 text-2xl font-semibold">
  <svg><!-- Icon --></svg>
  Page Title
</h2>
```

## CRUD Page Structure

### Standard CRUD Layout Pattern
Alle CRUD-Seiten (User Management, Domain Management) folgen dieser Struktur:

1. **Header Section** - Titel mit Icon
2. **Action Bar** - Suchfeld, Sortierung, Add-Button
3. **Data Table** - Responsive Tabelle mit Daten
4. **Pagination** - Bei mehr als einer Seite
5. **Modal Dialog** - Für Create/Edit-Operationen

### Action Bar Layout
```vue
<div class="flex gap-4 mb-8 flex-wrap items-center">
  <!-- Search Input -->
  <div class="relative flex-1 min-w-[250px]">
    <BaseInput size="lg" />
    <!-- Search Icon -->
  </div>
  
  <!-- Sort Controls -->
  <div class="flex gap-2">
    <BaseSelect size="lg" />
    <BaseSelect size="lg" />
  </div>
  
  <!-- Add Button -->
  <BaseButton variant="slate">
    <svg><!-- Plus Icon --></svg>
    Add Item
  </BaseButton>
</div>
```

### Data Table Structure
```vue
<div class="bg-white border border-gray-300 rounded min-h-[400px]">
  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center gap-3 p-16 text-gray-600">
    <div class="w-5 h-5 border-2 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
    <span>Loading...</span>
  </div>
  
  <!-- Error State -->
  <div v-else-if="error" class="text-center p-16 text-red-500">
    {{ error }}
  </div>
  
  <!-- Empty State -->
  <div v-else-if="items.length === 0" class="text-center p-16 text-gray-600">
    <svg class="mb-4 opacity-50"><!-- Icon --></svg>
    <h3 class="m-0 mb-2 text-2xl text-gray-700">No items found</h3>
    <p class="m-0 opacity-80">Description</p>
  </div>
  
  <!-- Data Table -->
  <div v-else>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="bg-gray-100 px-4 py-4 text-left border-b border-gray-300 font-medium text-sm text-gray-700">
            Column Header
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-4 border-b border-gray-200">Content</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## Button Components

### BaseButton Variants
- `primary` - Blaue Buttons für Hauptaktionen
- `secondary` - Weiße Buttons mit grauen Borders für sekundäre Aktionen
- `danger` - Rote Buttons für Löschaktionen
- `warning` - Gelbe Buttons für Warnungen
- `success` - Grüne Buttons für Bestätigungen
- `ghost` - Transparente Buttons
- `slate` - Dunkle Buttons für wichtige Add-Aktionen

### Button Sizes
- `sm` - Kleine Buttons für Tabellenaktionen (px-3 py-1.5 text-sm)
- `md` - Standard Buttons (px-4 py-2 text-sm)  
- `lg` - Große Buttons für Hauptaktionen (px-6 py-3 text-base)

### Icon Usage in Buttons
Buttons enthalten oft SVG-Icons mit 16x16px für small/medium und 20x20px für large buttons.

## Dialog/Modal System

### Standard Dialog Structure
```vue
<div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
  <div class="relative bg-white rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1)]">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Dialog Title</h3>
    </div>
    
    <!-- Content -->
    <form class="p-6 space-y-6">
      <!-- Form fields -->
    </form>
    
    <!-- Footer -->
    <div class="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-200">
      <BaseButton variant="secondary">Cancel</BaseButton>
      <BaseButton variant="success">Save</BaseButton>
    </div>
  </div>
</div>
```

### Dialog Properties
- **Backdrop**: Schwarzer Overlay mit 30% Opacity und Blur-Effekt
- **Container**: Weißer Container mit abgerundeten Ecken
- **Max Width**: 500px für Standard-Dialoge
- **Shadow**: Große, weiche Schatten für Depth
- **Z-Index**: 1000 für Overlay-Positioning

## Form Components

### Input Fields (BaseInput)
- Verwendung von `size="lg"` für Konsistenz in Action Bars
- Placeholder-Texte in grau
- Icons werden oft rechts im Input platziert

### Select Dropdowns (BaseSelect)
- Konsistente Größen mit anderen Form-Elementen
- Standard-Optionen für Sortierung: Created Date, Name, Status, Updated Date

### Toggle Switches (BaseToggle)
- Verfügbare Farben: blue, green, red, yellow, purple, indigo
- Standard: blue, für Status-Toggles: green
- Label-Text optional

## Status Badges

### Badge Styling
```vue
<span class="inline-block px-2 py-1 rounded-xl text-xs font-medium uppercase bg-green-100 text-green-800">
  Status Text
</span>
```

### Status-spezifische Farben
- **Enabled/Active**: grün (bg-green-100 text-green-800)
- **Disabled/Inactive**: rot (bg-red-100 text-red-800)
- **Admin**: gelb (bg-yellow-100 text-yellow-800)
- **Customer**: blau (bg-blue-100 text-blue-800)

## Pagination

### Standard Pagination Layout
```vue
<div class="flex items-center justify-between px-4 py-4 border-t border-gray-200">
  <BaseButton variant="secondary" size="sm" :disabled="!hasPrev">
    <svg><!-- Left Arrow --></svg>
    Previous
  </BaseButton>
  
  <div class="text-center text-gray-600 text-sm">
    <span>Page X of Y</span>
    <span class="block mt-1 text-xs opacity-80">(Z items total)</span>
  </div>
  
  <BaseButton variant="secondary" size="sm" :disabled="!hasNext">
    Next
    <svg><!-- Right Arrow --></svg>
  </BaseButton>
</div>
```

## Icons

### Icon Library
Alle Icons verwenden SVG mit Tabler Icons-Stil:
- **Stroke Width**: 2px standardmäßig, 1px für große decorative Icons
- **Size**: 16x16px für Buttons, 24x24px für Titel, 48x48px für Empty States
- **Colors**: currentColor für automatische Farbvererbung

### Häufig verwendete Icons
- **Search**: Lupe-Icon für Suchfelder
- **Plus**: Plus-Icon für Add-Buttons  
- **Edit**: Stift-Icon für Edit-Buttons
- **Delete**: Papierkorb-Icon für Delete-Buttons
- **Users**: User-Icon für User Management
- **Globe**: Globe-Icon für Domain Management

## Responsive Design

### Mobile Anpassungen
```css
@media (max-width: 768px) {
  .flex.gap-4.mb-8 {
    flex-direction: column;
    align-items: stretch;
  }
}
```

### Breakpoints
- **Mobile**: < 768px - Vertikales Layout für Action Bars
- **Tablet**: 768px - 1024px - Reduzierte Paddings
- **Desktop**: > 1024px - Volles Layout

## Loading & Error States

### Loading Spinner
```vue
<div class="w-5 h-5 border-2 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
```

### Error Messages
- Rote Farbe für Fehlermeldungen
- Zentriert in Container mit ausreichend Padding

### Empty States  
- Große Icons (48x48px) mit reduzierter Opacity
- Beschreibender Text mit Handlungsaufforderungen

## Typography

### Heading Hierarchy
- **h2**: text-2xl font-semibold für Seitentitel
- **h3**: text-lg font-semibold für Dialog-Titel
- **Labels**: text-sm font-medium für Formular-Labels

### Text Colors
- **Primary Text**: text-gray-900 / text-gray-700
- **Secondary Text**: text-gray-600
- **Muted Text**: text-gray-500 mit optional opacity-80

## Development Guidelines

### Component Usage
- Verwende immer Base-Components (BaseButton, BaseInput, etc.)
- Halte dich an die definierten Variants und Sizes
- Verwende einheitliche Spacing-Klassen (p-4, p-6, gap-2, gap-4)

### Accessibility
- Alle interaktiven Elemente haben focus-states
- Buttons haben title-Attribute für Tooltips
- Disabled-States sind visuell und funktional korrekt implementiert

### Performance
- Debounced Search (500ms) für alle Suchfelder
- Pagination für große Datensätze
- Loading States für alle async Operations