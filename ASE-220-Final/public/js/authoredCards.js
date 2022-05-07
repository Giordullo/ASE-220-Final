let cardContainer;

function getCurrentPage()
{
    var path = window.location.pathname;
    var page = path.split("/").pop();
    console.log( page );
    return page;
}

function CalcRating(rating)
{
    const avg = (array) => array.reduce((a, b) => a + b) / array.length;
    return avg(rating);
}

function createPodCastCard(Info) 
{

    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body bg-dark text-white';

    let title = document.createElement('h5');
    title.innerText = Info.Title;

    let desc = document.createElement('p');
    desc.innerText = Info.Desc;

    let journal = document.createElement('p');
    journal.innerText = "Journal: " + Info.Journal;

    let disc = document.createElement('p');
    disc.innerText = "Discipline(s): " + Info.disc;

    let tags = document.createElement('p');
    tags.innerText = "Tag(s): " + Info.tags;

    let date = document.createElement('h7');
    date.innerText = Info.Year;

    let doi = document.createElement('p');
    doi.innerText = "DOI: " + Info.DOI;

    let audio = document.createElement('audio');
    audio.controls = 'controls';

    let source = document.createElement('source');
    source.src = /*Info.File*/ "";
    source.type = "audio/mp3";

    let save = document.createElement('button');
    save.innerText = "Save";
    save.className = "btn btn-sm btn-primary btn-block";
    save.id = "savebutton";
    save.onclick = function() { Save(Info.Title); }

    let unsave = document.createElement('button');
    unsave.innerText = "Remove Save";
    unsave.className = "btn btn-sm btn-secondary btn-block";
    unsave.id = "savebutton";
    unsave.onclick = function() { Save(Info.Title); }

    let e = document.createElement('p');

    let star1 = document.createElement('button');
    if (Info.Rating > 0)
        star1.innerText = "★";
    else
        star1.innerText = "☆";
    star1.className = "btn btn-sm btn-dark btn-block";
    star1.onclick = function() { Rate(Info.Title, 1); }

    let star2 = document.createElement('button');
    if (Info.Rating > 1)
        star2.innerText = "★";
    else
        star2.innerText = "☆";
    star2.className = "btn btn-sm btn-dark btn-block";
    star2.onclick = function() { Rate(Info.Title, 2); }

    let star3 = document.createElement('button');
    if (Info.Rating > 2)
        star3.innerText = "★";
    else
        star3.innerText = "☆";
    star3.className = "btn btn-sm btn-dark btn-block";
    star3.onclick = function() { Rate(Info.Title, 3); }

    let star4 = document.createElement('button');
    if (Info.Rating > 3)
        star4.innerText = "★";
    else
        star4.innerText = "☆";
    star4.className = "btn btn-sm btn-dark btn-block";
    star4.onclick = function() { Rate(Info.Title, 4); }

    let star5 = document.createElement('button');
    if (Info.Rating > 4)
        star5.innerText = "★";
    else
        star5.innerText = "☆";
    star5.className = "btn btn-sm btn-dark btn-block";
    star5.onclick = function() { Rate(Info.Title, 5); }

    let likes = document.createElement('p');
    likes.innerText = "Likes: " + Info.Likes + "       Bookmarks: " +  checkBookmarks(Info.DOI);

    cardBody.appendChild(title);

        // Construct Multiple Author Names
        var FirstArray = seperateByComma(Info.First);
        var LastArray = seperateByComma(Info.Last);
        var owned = false;
        if (FirstArray.length <= 1)
        {
            if (getUsername() == FirstArray[0] + " " + LastArray[0])
                owned = true;
            let name = document.createElement('a');
            name.innerText = FirstArray[0] + " " + LastArray[0];
            name.href = "/users/" + FirstArray[0] + " " + LastArray[0];
            name.onclick = function() { setAuthor(FirstArray[0] + " " + LastArray[0]); }
            cardBody.appendChild(name);
        }
        else
        {
            for (let i = 0; i < FirstArray.length; i++)
            {
                if (getUsername() == FirstArray[i] + " " + LastArray[i])
                owned = true;
                let name = document.createElement('a');
                name.innerText = FirstArray[i] + " " + LastArray[i];
                name.href = "/users/" + FirstArray[i] + " " + LastArray[i];
                name.onclick = function() { setAuthor(FirstArray[i] + " " + LastArray[i]); }
                cardBody.appendChild(name);

                if (i != FirstArray.length - 1)
                    name.innerText = name.innerText + ", ";
            }
        }

    cardBody.appendChild(desc);
    cardBody.appendChild(journal);
    cardBody.appendChild(disc);
    cardBody.appendChild(tags);
    cardBody.appendChild(date);
    cardBody.appendChild(doi);
    cardBody.appendChild(likes);

    if (CheckIsLoggedIn())
    {
        cardBody.appendChild(star1);
        cardBody.appendChild(star2);
        cardBody.appendChild(star3);
        cardBody.appendChild(star4);
        cardBody.appendChild(star5);
    }

    cardBody.appendChild(e);
    cardBody.appendChild(audio);
    audio.appendChild(source);

    if (owned)
    {
        let edit = document.createElement('button');
        edit.innerText = "Edit";
        edit.className = "btn btn-sm btn-primary btn-block";
        edit.id = "savebutton";
        edit.onclick = function() { setEdit(Info.DOI); location.href="podcasts/" + Info.Title +"/edit"; }
        cardBody.appendChild(edit);
    }

    if (CheckIsLoggedIn() && !checkSaved(Info.DOI))
    {
        cardBody.appendChild(save);
    }
    else if (checkSaved(Info.DOI))
    {
        cardBody.appendChild(unsave);
    }


    card.appendChild(cardBody);
    cardContainer.appendChild(card);

}

let initListOfPodCasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('PodCast-card').replaceWith(cardContainer);
        return;
    }

    var path = window.location.pathname;
    var page = path.replace("/users/", "");
    page = page.replace("/podcasts/authored", "");

    var urlToName = page.replace("%20", " ");

    var settings = 
    {
        "url": url + "/api/users/" + urlToName + "/podcasts/authored",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function(data)
    {
        console.log(JSON.stringify(data));

        cardContainer = document.getElementById('PodCast-card');

        for (let i = 0; i < data.length; i++)
        {
            var Info = 
            {
                //"Name" : (data[index]['First'] + " " + data[index]['Last']),
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "Email" : data[i]['email'],
                "Title" : data[i]['article_title'],
                "Desc" : data[i]['desc'],
                "Journal" : data[i]['journal'],
                "Day" : data[i]['day'],
                "Month" : data[i]['month'],
                "Year" : data[i]['year'],
                "DOI" : data[i]['doi'],
                "Keywords" : data[i]['keywords'],
                "File" : data[i]['file'],
                "Rating" : CalcRating(data[i]['rating']),
                "Likes" : data[i]['rating'].length,
                "disc": data[i]['disc'],
                "tags": data[i]['tags'],
                "url": data[i]['url']
            }

            createPodCastCard(Info); 
        }
    });
};

console.log(getCurrentPage());

initListOfPodCasts();
