jQuery(document).ready(function ($) {
    $('#fill_fields').on('click', function () {
        const animeId = $('#anime_id').val();
        if (!animeId) {
            alert('Inserisci un ID anime.');
            return;
        }

        // Query GraphQL per ottenere i dati da AniList
        const query = `
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                title {
                    romaji
                    english
                    native
                }
                description
                episodes
                status
                duration
                genres
                averageScore
                popularity
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
                coverImage {
                    large
                }
                bannerImage
                siteUrl
            }
        }`;

        fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: { id: parseInt(animeId) }
            })
        })
        .then(response => response.json())
        .then(data => {
            const anime = data.data.Media;
            if (!anime) {
                alert('Anime non trovato.');
                return;
            }

            // Riempimento campi ACF
            $('input[name="acf[title_romaji]"]').val(anime.title.romaji);
            $('input[name="acf[title_english]"]').val(anime.title.english);
            $('input[name="acf[title_native]"]').val(anime.title.native);
            $('textarea[name="acf[description]"]').val(anime.description);
            $('input[name="acf[episodes]"]').val(anime.episodes);
            $('input[name="acf[status]"]').val(anime.status);
            $('input[name="acf[duration]"]').val(anime.duration);
            $('input[name="acf[genres]"]').val(anime.genres.join(', '));
            $('input[name="acf[average_score]"]').val(anime.averageScore);
            $('input[name="acf[popularity]"]').val(anime.popularity);
            $('input[name="acf[start_date]"]').val(`${anime.startDate.year}-${anime.startDate.month}-${anime.startDate.day}`);
            $('input[name="acf[end_date]"]').val(`${anime.endDate.year}-${anime.endDate.month}-${anime.endDate.day}`);
            $('input[name="acf[cover_image]"]').val(anime.coverImage.large);
            $('input[name="acf[banner_image]"]').val(anime.bannerImage);
            $('input[name="acf[site_url]"]').val(anime.siteUrl);

            alert('Campi compilati con successo!');
        })
        .catch(error => {
            console.error(error);
            alert('Errore durante il recupero dei dati.');
        });
    });
});
