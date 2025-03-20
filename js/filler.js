jQuery(document).ready(function ($) {
    $('#fill_fields').on('click', function () {
        const animeId = $('#anime_id').val();
        if (!animeId) {
            alert('Inserisci un ID anime.');
            return;
        }

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
                characters {
                    edges {
                        node {
                            name {
                                full
                            }
                            image {
                                large
                            }
                        }
                        voiceActors {
                            name {
                                full
                            }
                            image {
                                large
                            }
                        }
                    }
                }
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

            const titleEnglish = anime.title.english || anime.title.romaji;
            const description = anime.description || '';

            $('#title').val(titleEnglish);
            $('#content').val(description);

            // Campi ACF
            $('input[name="acf[title_romaji]"]').val(anime.title.romaji);
            $('input[name="acf[title_english]"]').val(titleEnglish);
            $('input[name="acf[title_native]"]').val(anime.title.native);
            $('textarea[name="acf[description]"]').val(description);
            $('input[name="acf[episodes]"]').val(anime.episodes);
            $('input[name="acf[status]"]').val(anime.status);
            $('input[name="acf[duration]"]').val(anime.duration);
            $('input[name="acf[year]"]').val(anime.startDate.year);
            $('input[name="acf[average_score]"]').val(anime.averageScore);
            $('input[name="acf[popularity]"]').val(anime.popularity);
            $('input[name="acf[cover_image]"]').val(anime.coverImage.large);
            $('input[name="acf[banner_image]"]').val(anime.bannerImage);
            $('input[name="acf[site_url]"]').val(anime.siteUrl);

            // Categorie (solo Generi)
            const genres = anime.genres || [];
            genres.forEach(genre => {
                $('#taxonomy-category').append(`<li id="category-${genre}" class="acf-checkbox-list-item"><label><input type="checkbox" name="post_category[]" value="${genre}" checked> ${genre}</label></li>`);
            });

            alert('Campi, categorie (generi) e contenuto del post compilati con successo!');
        })
        .catch(error => {
            console.error(error);
            alert('Errore durante il recupero dei dati.');
        });
    });
});
