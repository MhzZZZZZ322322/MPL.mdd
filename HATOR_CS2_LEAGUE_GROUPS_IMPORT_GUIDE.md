# HATOR CS2 LEAGUE MOLDOVA - Ghid Import Excel în Google Sheets

## Fișiere necesare:
1. **HATOR_CS2_LEAGUE_GROUPS.csv** - Fișierul principal cu datele
2. **HATOR_CS2_LEAGUE_GROUPS_TEMPLATE.md** - Documentația completă

## Pași pentru import în Google Sheets:

### 1. Crearea Google Sheets
- Deschide Google Sheets
- Creează un document nou
- Denumește-l: **"HATOR CS2 LEAGUE MOLDOVA - Grupe"**

### 2. Importul datelor CSV
- File → Import → Upload
- Selectează fișierul **HATOR_CS2_LEAGUE_GROUPS.csv**
- Separator type: **Comma**
- Convert text to numbers: **Yes**

### 3. Separarea în sheet-uri
CSV-ul conține date pentru 9 sheet-uri diferite. Filtrează datele după coloana A:

#### Sheet 1: "Groups_Overview"
- Filtrează rândurile care încep cu "Groups_Overview"
- Copiază în sheet nou numit "Groups_Overview"
- Header: Group_ID | Group_Name | Group_Display | Teams_Count | Status

#### Sheet 2-8: "Group_A" până la "Group_G"
Pentru fiecare grupă (A, B, C, D, E, F, G):
- Filtrează rândurile care încep cu "Group_A" (respectiv B, C, D, E, F, G)
- Copiază în sheet nou numit "Group_A" (respectiv Group_B, etc.)
- Header: Position | Team_Name | Matches_Played | Wins | Draws | Losses | Rounds_Won | Rounds_Lost | Round_Diff | Points | Last_Updated

#### Sheet 9: "Matches_Results"
- Filtrează rândurile care încep cu "Matches_Results"
- Copiază în sheet nou numit "Matches_Results"
- Header: Match_ID | Group_Name | Team1 | Team2 | Team1_Score | Team2_Score | Status | Date_Played | Notes

### 4. Configurarea pentru API
După import:
1. **Share document** cu permisiuni "Anyone with the link can view"
2. **Copiază ID-ul documentului** din URL
3. **Furnizează credențialele Google API** pentru sincronizarea automată

### 5. Actualizarea rezultatelor
Pentru a înregistra rezultate în sheet-ul "Matches_Results":

**Exemplu de rezultat completat:**
```
Match_ID: 1
Group_Name: Group A
Team1: Auratix
Team2: Barbosii
Team1_Score: 16
Team2_Score: 14
Status: completed
Date_Played: 2025-06-17 18:30:00
Notes: Meci foarte strâns
```

### 6. Reguli importante:
- **Nu șterge coloanele** - sistemul se bazează pe structura exactă
- **Respectă formatele** de dată: YYYY-MM-DD HH:MM:SS
- **Verifică numele echipelor** - trebuie identice cu baza de date
- **Status meciuri**: doar "scheduled", "live", "completed"

### 7. Punctaj CS2:
- **Victorie**: 3 puncte
- **Înfrângere**: 0 puncte (nu există egalitate în CS2)
- **Rounds**: Format exact (ex: 16-14, 16-10, 16-3)

### 8. Sincronizare automată:
După configurarea corectă, site-ul va:
- Citi datele la fiecare minut
- Calcula automat clasamentele
- Actualiza pozițiile echipelor
- Afișa rezultatele în timp real

## Structura completă a fișierelor:

### Groups_Overview (8 rânduri)
| Group_ID | Group_Name | Group_Display | Teams_Count | Status |
|----------|------------|---------------|-------------|---------|
| 1-7      | A-G        | Group A-G     | 6 sau 7     | active  |

### Group_A până Group_G (43 echipe total)
| Position | Team_Name | Matches_Played | Wins | Draws | Losses | Rounds_Won | Rounds_Lost | Round_Diff | Points | Last_Updated |
|----------|-----------|----------------|------|-------|--------|------------|-------------|------------|---------|--------------|
| 1-6/7    | Nume      | 0              | 0    | 0     | 0      | 0          | 0           | 0          | 0       | Data        |

### Matches_Results (toate meciurile posibile)
| Match_ID | Group_Name | Team1 | Team2 | Team1_Score | Team2_Score | Status | Date_Played | Notes |
|----------|------------|--------|--------|-------------|-------------|---------|-------------|--------|
| 1-210    | Group A-G  | Echipa | Echipa | Gol         | Gol         | scheduled | Gol       | Gol    |

Fișierul CSV conține toate aceste date structurate corect pentru import automat.