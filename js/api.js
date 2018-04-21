(function () {
    'use strict';

    var category = null;
    var search = null;

    var API = 'https://newsapi.org/v2/';
    var ENDPOINT_HEADLINES = 'top-headlines?';
    var ENDPOINT_EVERYTHING = 'everything?';
    var API_KEY = 'apiKey=c5a59e6e745f45849e2e56af4efad07d';

    var hasShareFunctionality;

    // Sobre funcionalidade de 'share' https://whatwebcando.today/app-communication.html
    if ('share' in navigator) {
        hasShareFunctionality = true;
    } else {
        hasShareFunctionality = false;
    }

    console.log('share disponibility: ' + hasShareFunctionality);

// funcionalidade de pegar a localização https://whatwebcando.today/geolocation.html
var target = document.getElementById('target');
var watchId;

function appendLocation(location, verb) {
  verb = verb || 'updated';
  var newLocation = document.createElement('p');
   console.log('Location ' + verb + 
   ': <a href="https://maps.google.com/maps?&z=15&q=' 
   + location.coords.latitude + '+' + location.coords.longitude 
   + '&ll=' + location.coords.latitude + '+' + location.coords.longitude 
   + '" target="_blank">' + location.coords.latitude + ', ' + location.coords.longitude + '</a>');
}

if ('geolocation' in navigator) {
  document.getElementById('askButton').addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(function (location) {
      appendLocation(location, 'fetched');
    });
    watchId = navigator.geolocation.watchPosition(appendLocation);
  });
} else {
    console.log('Geolocation API not supported.');
}

    getNews();

    function getNews() {
        var url = API + ENDPOINT_HEADLINES + 'country=br&' + API_KEY + getCategory();
        $.get(url, success);
    }

    function getNewsWithSearch() {
        var url = API + ENDPOINT_EVERYTHING + API_KEY + getSearch();
        $.get(url, success);
    }

    function success(data) {
        var divNews = $('#news');
        divNews.empty();
        setTopNews(data.articles[0]);
        for (var i = 1; i < data.articles.length; ++i) {
            divNews.append(getNewsHtml(data.articles[i]));
        }
    }

    function setTopNews(article) {
        if (article) {
            $('#top-news-title').text(article.title);
            $('#top-news-description').text(article.description);
            $('#top-news-image').attr('src', article.urlToImage).attr('alt', article.title);
            $('#top-news-link').attr('href', article.url);
        }
    }

    $("#headline").click(function () {
        category = null;
        activeMenu($(this));
    });
    $("#health").click(function () {
        category = 'health';
        activeMenu($(this));
    });
    $("#sports").click(function () {
        category = 'sports';
        activeMenu($(this));
    });
    $("#entertainment").click(function () {
        category = 'entertainment';
        activeMenu($(this));
    });
    $("#technology").click(function () {
        category = 'technology';
        activeMenu($(this));
    });
    $("#search").keypress(function (ev) {
        if (ev.which == 13) {
            search = $(this).val();
            if (search) {
                getNewsWithSearch();
            } else {
                getNews();
            }
        }
    });

    function activeMenu(menu) {
        search = null;
        $("#search").val('');
        $('li.active').removeClass('active');
        menu.addClass('active');
        getNews();
    }

    function getCategory() {
        if (category) {
            return '&category=' + category
        }
        return '';
    }

    function getSearch() {
        if (search) {
            return '&q=' + search
        }
        return '';
    }

    function getNewsHtml(article) {
        var card = $('<div>').addClass('card mb-4 box-shadow');

        card = addImage(card);
        card = addBodyTitle(card);
        card = addBodyActions(card);

        var container = $('<div>').addClass('col-xs-12 col-md-6 col-lg-4');
        container.append(card);
        return container;

        function addImage(card) {
            if (article.urlToImage) {
                return card.append(
                    $('<img>')
                    .attr('src', '/images/image-default.png')
                    .attr('alt', article.title)
                    .attr('data-src', article.urlToImage)
                    .addClass('lazy card-img-top')
                );
            }
            return card;
        }

        function addBodyTitle(card) {
            return card.append(
                $('<div>')
                .addClass('card-body')
                .append($('<h5>').addClass('card-title').append(article.title))
                .append($('<p>').addClass('card-text').append(article.description))
                .append($('<h6>').addClass('card-subtitle mb-2 text-muted')
                    .append(moment(article.publishedAt).fromNow()))
            );
        }

        function addBodyActions(card) {
            return card.append(
                $('<div>')
                .addClass('card-body')
                .append($('<button>').append('Read Article').addClass('btn btn-link').attr('type', 'button')
                    .click(function () {
                        window.open(article.url, '_blank', 'noopener');
                    }))
                .append(
                    $('<button>').addClass('btn btn-default')
                    .attr('aria-label', 'compartilhar')
                    .prop("disabled", !hasShareFunctionality)
                    .click(function () {
                        navigator.share({
                                title: article.title,
                                text: article.description,
                                url: article.url
                            })
                            .then(() => console.log('Successful share'))
                            .catch(error => console.log('Error sharing', error))
                    })
                    .append($('<i>').addClass('fas fa-share-alt')))
            );
        }
    }

})();
