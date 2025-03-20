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

            // Imposta il titolo e la descrizione del post
            $('#title').val(titleEnglish);
            $('#content').val(description);

            // Campi ACF - Usa ID anziché nome per maggiore robustezza
            $('#acf-field_63f8a1a8a1b1e').val(anime.title.romaji);    // Title Romaji
            $('#acf-field_63f8a1a8a1b1f').val(titleEnglish);          // Title English
            $('#acf-field_63f8a1a8a1b20').val(anime.title.native);    // Title Native
            $('#acf-field_63f8a1a8a1b21').val(description);           // Description
            $('#acf-field_63f8a1a8a1b22').val(anime.episodes);        // Episodes
            $('#acf-field_63f8a1a8a1b23').val(anime.status);          // Status
            $('#acf-field_63f8a1a8a1b24').val(anime.duration);        // Duration
            $('#acf-field_63f8a1a8a1b25').val(anime.averageScore);    // Average Score
            $('#acf-field_63f8a1a8a1b26').val(anime.popularity);      // Popularity
            $('#acf-field_63f8a1a8a1b27').val(anime.coverImage.large); // Cover Image
            $('#acf-field_63f8a1a8a1b28').val(anime.bannerImage);     // Banner Image
            $('#acf-field_63f8a1a8a1b29').val(anime.siteUrl);         // Site URL

            // Categorie (solo generi)
            const genres = anime.genres || [];
            genres.forEach(genre => {
                let categoryCheckbox = $(`#taxonomy-category input[value="${genre}"]`);
                if (categoryCheckbox.length === 0) {
                    // Aggiungi la categoria se non esiste
                    $('#newcategory').val(genre);
                    $('#category-add-submit').click();
                } else {
                    categoryCheckbox.prop('checked', true);
                }
            });

            // Riempimento campi attori (repeater ACF)
            const repeater = $('[data-name="actors"] .acf-repeater');
            anime.characters.edges.forEach((edge, index) => {
                const actorName = edge.voiceActors[0]?.name.full || '';
                const actorImage = edge.voiceActors[0]?.image.large || '';
                const characterName = edge.node.name.full;
                const characterImage = edge.node.image.large;

                // Aggiungi una nuova riga nel repeater
                repeater.find('.acf-button').click();

                // Seleziona l'ultima riga aggiunta
                const row = repeater.find('.acf-row:not(.acf-clone):last');

                // Riempie i campi del repeater
                row.find('[id*="actor_name"]').val(actorName);
                row.find('[id*="actor_image"]').val(actorImage);
                row.find('[id*="character_name"]').val(characterName);
                row.find('[id*="character_image"]').val(characterImage);
            });

            alert('Campi, categorie e contenuto del post compilati con successo!');
        })
        .catch(error => {
            console.error(error);
            alert('Errore durante il recupero dei dati.');
        });
    });
});
