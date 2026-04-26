# Akasha Clone - Genshin Impact Showcase

A website similar to Akasha for showcasing Genshin Impact characters, artifacts, and a global leaderboard.

## Getting Started

### Prerequisites

- [Supabase Account](https://supabase.com/)
- [Next.js](https://nextjs.org/)

### Setup

1.  **Clone the repository.**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    NEXT_SUPABASE_SECRET_KEY=your_supabase_service_role_key
    ```
4.  **Database Migration**:
    Run the SQL found in `supabase/migrations/20240520000000_init.sql` in your Supabase SQL Editor to set up the schema and RLS policies.

### Data Fetching & Sync

The website populates its database by fetching data from the **Enka Network API**.

- **How to fetch data**:
  - Enter a 9-digit Genshin Impact UID in the search bar on the home page.
  - The application will automatically call the Enka API, parse the character showcase, and sync the data (Profile, Characters, and Artifacts) to your Supabase database.
- **Username Search**:
  - Once a user has been searched by UID at least once, they can be found by their **Nickname** in the search bar.
- **Leaderboard**:
  - The leaderboard is automatically updated based on the data stored in your Supabase instance, ranked by the "Crit Value" (2*CR + CD) of the characters.

### Enka API Limitations

- **Rate Limiting**: Enka Network has rate limits. Avoid making too many requests in a short period.
- **Showcase Settings**: Characters will only appear if they are set to **"Show Character Detail"** in the user's Genshin Impact in-game profile. Only the 8 characters currently in the showcase can be fetched.

## Tech Stack

- **Framework**: Next.js (Pages Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase
- **Data Source**: Enka.Network
