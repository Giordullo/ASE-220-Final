//let podcastDB = 'https://jsonblob.com/api/jsonBlob/953773366167486464';

let cardContainer;

function getCurrentPage()
{
    var path = window.location.pathname;
    var page = path.split("/").pop();
    console.log( page );
    return page;
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

function createDiscCard(Info) 
{

    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body bg-dark text-white';

    let title = document.createElement('h5');
    title.innerText = Info.disc;

    let name = document.createElement('h6');
    name.innerText = "Amount of Podcasts: " + Info.amount;

    let save = document.createElement('button');
    save.innerText = "View Podcasts";
    save.className = "btn btn-sm btn-primary btn-block";
    save.id = "viewpodcasts";
    save.onclick = function() { setSearch(Info.disc); }

    cardBody.appendChild(title);
    cardBody.appendChild(name);
    cardBody.appendChild(save);

    card.appendChild(cardBody);
    cardContainer.appendChild(card);

}

function createAuthorCard(Info) 
{

    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body bg-dark text-white';

    let title = document.createElement('h4');
    title.innerText = Info.First + " " + Info.Last;

    let name = document.createElement('h6');
    name.innerText = "Scientific Discipline(s): " + Info.disc;

    let tag = document.createElement('h6');
    tag.innerText = "Tag(s): " + Info.tags;

    let ti = document.createElement('h6');
    ti.innerText = "Title: " + Info.Title;

    let org = document.createElement('h6');
    org.innerText = "Org: " + Info.Org;

    let email= document.createElement('h5');
    email.innerText = Info.Email;

    let bio = document.createElement('p');
    bio.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    let GS = document.createElement('button');
    GS.innerText = "Google Scholar";
    GS.className = "btn btn-sm btn-primary btn-block";
    GS.style = "margin-right: 2%;";
    GS.onclick = function() { };

    let RG = document.createElement('button');
    RG.innerText = "Researchgate";
    RG.className = "btn btn-sm btn-primary btn-block";
    RG.style = "margin-right: 2%;";
    RG.onclick = function() { };

    let LI = document.createElement('button');
    LI.innerText = "LinkedIn";
    LI.className = "btn btn-sm btn-primary btn-block";
    LI.style = "margin-right: 2%;";
    LI.onclick = function() { };

    let OR = document.createElement('button');
    OR.innerText = "ORCID";
    OR.className = "btn btn-sm btn-primary btn-block";
    OR.style = "margin-right: 2%;";
    OR.onclick = function() { };

    let p = document.createElement('p');
    p.innerText = "";

    let follow = document.createElement('button');
    follow.innerText = "Follow";
    follow.className = "btn btn-sm btn-primary btn-block";
    follow.id = "followbutton";
    follow.onclick = function() { Follow(Info.First + " " + Info.Last); }

    let unfollow = document.createElement('button');
    unfollow.innerText = "Unfollow";
    unfollow.className = "btn btn-sm btn-secondary btn-block";
    unfollow.id = "unfollowbutton";
    unfollow.onclick = function() { /*Un*/Follow(Info.First + " " + Info.Last); }

    cardBody.appendChild(title);
    cardBody.appendChild(name);
    cardBody.appendChild(tag);
    cardBody.appendChild(ti);
    cardBody.appendChild(org);
    cardBody.appendChild(email);

    cardBody.appendChild(bio);

    cardBody.appendChild(GS);
    cardBody.appendChild(RG);
    cardBody.appendChild(LI);
    cardBody.appendChild(OR);

    cardBody.appendChild(p);

    if (CheckIsLoggedIn() && !checkFollowed(Info.First + " " + Info.Last))
    {
        cardBody.appendChild(follow);
    }
    else if (checkFollowed(Info.First + " " + Info.Last))
    {
        cardBody.appendChild(unfollow);
    }

    card.appendChild(cardBody);
    cardContainer.appendChild(card);

}

function setSortType(type)
{
    localStorage.setItem('SortType', type);
    location.reload();
}

function getSortType()
{
    return localStorage.getItem('SortType');
}

function setPage(page)
{
    localStorage.setItem('Page', page);
    location.reload();
}

function getPage()
{
    return localStorage.getItem('Page');
}

function setSearch(search)
{
    if (getCurrentPage() == "keywords")
    {
        console.log(search);
        localStorage.setItem('Search', search);
        window.location.href = "/keywords/" + localStorage.getItem('Search');
        console.log(localStorage.getItem('Search'));
    }
    else if (getCurrentPage() == "categories")
    {
        console.log(search);
        localStorage.setItem('Search', search);
        window.location.href = "/categories/" + localStorage.getItem('Search');
        console.log(localStorage.getItem('Search'));
    }
    else
    {
        console.log("Normal Search");
        localStorage.setItem('Search', search);
        window.location.href = "/search";
        console.log(localStorage.getItem('Search'));
    }
}

function setGSearch(search)
{
    localStorage.setItem('Search', search);
}

function getSearch()
{
    return localStorage.getItem('Search');
}

function setPodcastAmount(amt)
{
    localStorage.setItem('PodcastAmount', amt);
}

function getPodcastAmount()
{
    return localStorage.getItem('PodcastAmount');
}

function GotoPage(goto) // Page Buttons
{
    if (getPodcastAmount > 15 && goto == 1) // Forward
        setPage(getPage + 1);
    if (getPodcastAmount > 15 && goto == 0) // Back
        setPage(getPage - 1);
}

function CalcRating(rating)
{
    const avg = (array) => array.reduce((a, b) => a + b) / array.length;
    return avg(rating);
}

function CalcBookmarks(doi, marks)
{
    for (var i = 0; i < marks.length(); i++)
    {
        
    }
}

let initListOfPodCasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('PodCast-card').replaceWith(cardContainer);
        return;
    }

    var settings = 
    {
        "url": url + "/api/",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function(data)
    {
        console.log(JSON.stringify(data));

        cardContainer = document.getElementById('PodCast-card');

        let Page = getPage();

        if (Page === null)
        {
            setPage(1);
        }

        // Should you custom search
        let Search = getSearch();
        let customSearch = false;

        if (Search === null || Search == "")
            customSearch = false;
        else
            customSearch = true;
        
        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sortType = getSortType();

        if (sortType === null)
        {
            setSortType('newest');
        }

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            if ((sortType != "newest" && sortType != "oldest") && data[i]['year'] != sortType)
                continue;

            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        if (sortType === "newest")
            sort.sort((date1, date2) => date2.Date - date1.Date);
        else if (sortType === "oldest")
            sort.sort((date1, date2) => date1.Date - date2.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        setPodcastAmount(data.length); // Set podcast amount so we can tell if there is more then 1 page
        for (let i = 0; i < data.length; i++) 
        {

            // No greater than 15 Objects a Page
            if (i > 15 && Page == 1)
                continue;
            else if (Page > 1 && i < ((Page * 15) - 15))
                continue;
            else if (i > (15 * Page))
                continue;

            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            let isKeyword = false;
            if (customSearch)
            {
                for (let j = 0; j < data[index]['keywords'].length; j++)
                {
                    if (getSearch() == data[index]['keywords'][j])
                        isKeyword = true;
                }

                if (getSearch() == data[index]['article_title'])
                    isKeyword = true;

                // Construct Multiple Author Names
                var FirstArray = seperateByComma(data[index]['First']);
                var LastArray = seperateByComma(data[index]['Last']);

                for (let j = 0; j < FirstArray.length; j++)
                {
                    if (getSearch() == FirstArray[j])
                    isKeyword = true;
                }

                for (let j = 0; j < LastArray.length; j++)
                {
                    if (getSearch() == LastArray[j])
                    isKeyword = true;
                }

                for (let j = 0; j < FirstArray.length; j++)
                {
                    if (getSearch() == FirstArray[j] + " " + LastArray[j])
                    isKeyword = true;
                }

                if (getSearch() == data[index]['doi'])
                isKeyword = true;

                // Construct Multiple Tags and Disciplines
                var TagsArray = seperateByComma(data[index]['tags']);
                var DiscArray = seperateByComma(data[index]['disc']);

                for (let j = 0; j < TagsArray.length; j++)
                {
                    if (getSearch() == TagsArray[j])
                    isKeyword = true;
                }

                for (let j = 0; j < DiscArray.length; j++)
                {
                    if (getSearch() == DiscArray[j])
                    isKeyword = true;
                }

                if (!isKeyword)
                    continue;
            }

            var Info = 
            {
                //"Name" : (data[index]['First'] + " " + data[index]['Last']),
                "First" : (data[index]['First']),
                "Last" : (data[index]['Last']),
                "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Desc" : data[index]['desc'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
                "Likes" : data[index]['rating'].length,
                "disc": data[index]['disc'],
                "tags": data[index]['tags'],
                "url": data[index]['url']
            }

            createPodCastCard(Info); 
        }
    });
};

let initListOfSearchedPodCasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('PodCast-card').replaceWith(cardContainer);
        return;
    }

    var settings = 
    {
        "url": url + "/api/all/",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function(data)
    {
        console.log(JSON.stringify(data));

        cardContainer = document.getElementById('PodCast-card');

        let Page = getPage();

        if (Page === null)
        {
            setPage(1);
        }

        // Should you custom search
        let Search = getSearch();
        let customSearch = false;

        if (Search === null || Search == "")
            customSearch = false;
        else
            customSearch = true;
        
        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sortType = getSortType();

        if (sortType === null)
        {
            setSortType('newest');
        }

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            if ((sortType != "newest" && sortType != "oldest") && data[i]['year'] != sortType)
                continue;

            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        if (sortType === "newest")
            sort.sort((date1, date2) => date2.Date - date1.Date);
        else if (sortType === "oldest")
            sort.sort((date1, date2) => date1.Date - date2.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        setPodcastAmount(data.length); // Set podcast amount so we can tell if there is more then 1 page
        for (let i = 0; i < data.length; i++) 
        {

            // No greater than 15 Objects a Page
            if (i > 15 && Page == 1)
                continue;
            else if (Page > 1 && i < ((Page * 15) - 15))
                continue;
            else if (i > (15 * Page))
                continue;

            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            let isKeyword = false;
            if (customSearch)
            {
                for (let j = 0; j < data[index]['keywords'].length; j++)
                {
                    if (getSearch() == data[index]['keywords'][j])
                        isKeyword = true;
                }

                if (getSearch() == data[index]['article_title'])
                    isKeyword = true;

                // Construct Multiple Author Names
                var FirstArray = seperateByComma(data[index]['First']);
                var LastArray = seperateByComma(data[index]['Last']);

                for (let j = 0; j < FirstArray.length; j++)
                {
                    if (getSearch() == FirstArray[j])
                    isKeyword = true;
                }

                for (let j = 0; j < LastArray.length; j++)
                {
                    if (getSearch() == LastArray[j])
                    isKeyword = true;
                }

                for (let j = 0; j < FirstArray.length; j++)
                {
                    if (getSearch() == FirstArray[j] + " " + LastArray[j])
                    isKeyword = true;
                }

                if (getSearch() == data[index]['doi'])
                isKeyword = true;

                // Construct Multiple Tags and Disciplines
                var TagsArray = seperateByComma(data[index]['tags']);
                var DiscArray = seperateByComma(data[index]['disc']);

                for (let j = 0; j < TagsArray.length; j++)
                {
                    if (getSearch() == TagsArray[j])
                    isKeyword = true;
                }

                for (let j = 0; j < DiscArray.length; j++)
                {
                    if (getSearch() == DiscArray[j])
                    isKeyword = true;
                }

                if (!isKeyword)
                    continue;
            }

            var Info = 
            {
                //"Name" : (data[index]['First'] + " " + data[index]['Last']),
                "First" : (data[index]['First']),
                "Last" : (data[index]['Last']),
                "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Desc" : data[index]['desc'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
                "Likes" : data[index]['rating'].length,
                "disc": data[index]['disc'],
                "tags": data[index]['tags'],
                "url": data[index]['url']
            }

            createPodCastCard(Info); 
        }
    });
};

let initUploadedPodcasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('UploadedPodCast-card').replaceWith(cardContainer);
        return;
    }

    var settings = 
    {
        "url": url + "/api/all/",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function(data)
    {
        cardContainer = document.getElementById('UploadedPodCast-card');

        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        // Newest First
        sort.sort((date1, date2) => date2.Date - date1.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        for (let i = 0; i < data.length; i++) 
        {
            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            // Don't Render if not the authors
            if (data[index]['email'] != localStorage.getItem('Email'))
                continue;

            var Info = 
            {
                //"Name" : (data[index]['First'] + " " + data[index]['Last']),
                "First" : (data[index]['First']),
                "Last" : (data[index]['Last']), "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Desc" : data[index]['desc'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
                "Likes" : data[index]['rating'].length,
                "disc": data[index]['disc'],
                "tags": data[index]['tags'],
                "url": data[index]['url']
            }
            console.log(CalcRating(data[i]['rating']));

            createPodCastCard(Info); 
        }
    });
};

let initSavedPodcasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('SavedPodCast-card').replaceWith(cardContainer);
        return;
    }

    var settings = 
    {
        "url": url + "/api/all/",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function(data)
    {
        cardContainer = document.getElementById('SavedPodCast-card');

        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        // Newest First
        sort.sort((date1, date2) => date2.Date - date1.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        for (let i = 0; i < data.length; i++) 
        {
            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            let isSaved = false;
            let savedArray = JSON.parse(localStorage.getItem('Saved'));
            console.log(savedArray);
            // Don't Render if not saved
            for (let j = 0; j < savedArray.length; j++)
            {
                if (data[index]['doi'] == savedArray[j])
                    isSaved = true;
            }

            if (!isSaved)
                continue;

            var Info = 
            {
                //"Name" : (data[index]['First'] + " " + data[index]['Last']),
                "First" : (data[index]['First']),
                "Last" : (data[index]['Last']),
                "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Desc" : data[index]['desc'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
                "Likes" : data[index]['rating'].length,
                "disc": data[index]['disc'],
                "tags": data[index]['tags'],
                "url": data[index]['url']
            }

            createPodCastCard(Info); 
        }
    });
};

let initAuthorUploadedPodcasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('UploadedPodCast-card').replaceWith(cardContainer);
        return;
    }

    var urlToName = getCurrentPage().replace("%20", " ");

    console.log(urlToName);

    var settings = {
        "url": url + "/api/users/" +  urlToName + "/podcasts/authored",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function(data)
    {
        cardContainer = document.getElementById('UploadedPodCast-card');

        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        // Newest First
        sort.sort((date1, date2) => date2.Date - date1.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        for (let i = 0; i < data.length; i++) 
        {
            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            // Don't Render if not the authors
            if (data[index]['email'] != localStorage.getItem('AuthorEmail'))
                continue;

            var Info = 
            {
                //"Name" : (data[index]['First'] + " " + data[index]['Last']),
                "First" : (data[index]['First']),
                "Last" : (data[index]['Last']), "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Desc" : data[index]['desc'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
                "Likes" : data[index]['rating'].length,
                "disc": data[index]['disc'],
                "tags": data[index]['tags'],
                "url": data[index]['url']
            }
            console.log(CalcRating(data[i]['rating']));

            createPodCastCard(Info); 
        }
    });
};

let initAuthorSavedPodcasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('SavedPodCast-card').replaceWith(cardContainer);
        return;
    }

    var urlToName = getCurrentPage().replace("%20", " ");

    var settings = {
        "url": url + "/api/users/" + urlToName + "/podcasts/saves",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function(data)
    {
        cardContainer = document.getElementById('SavedPodCast-card');

        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        // Newest First
        sort.sort((date1, date2) => date2.Date - date1.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        for (let i = 0; i < data.length; i++) 
        {
            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            /*
            let isSaved = false;
            let savedArray = JSON.parse(localStorage.getItem('AuthorSaved'));
            console.log(savedArray);
            // Don't Render if not saved
            for (let j = 0; j < savedArray.length; j++)
            {
                if (data[index]['doi'] == savedArray[j])
                    isSaved = true;
            }

            if (!isSaved)
                continue;
            */

            var Info = 
            {
                //"Name" : (data[index]['First'] + " " + data[index]['Last']),
                "First" : (data[index]['First']),
                "Last" : (data[index]['Last']),
                "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Desc" : data[index]['desc'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
                "Likes" : data[index]['rating'].length,
                "disc": data[index]['disc'],
                "tags": data[index]['tags'],
                "url": data[index]['url']
            }

            createPodCastCard(Info); 
        }
    });
};

let initDisciplines = () => 
{
    if (cardContainer) 
    {
        document.getElementById('PodCast-card').replaceWith(cardContainer);
        return;
    }

    var settings = {
        "url": url + "/api/categories",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function(data)
    {
        cardContainer = document.getElementById('PodCast-card');

        for (let i = 0; i < data.length; i++) 
        {
            var Info = 
            {
                "disc" : data[i]["Disc"],
                "amount" : data[i]["Amount"],
            }

            createDiscCard(Info); 
        }
    });
};

let initAuthors = () => 
{
    if (cardContainer) 
    {
        document.getElementById('PodCast-card').replaceWith(cardContainer);
        return;
    }

    var urlToName = getCurrentPage().replace("%20", " ");

    var settings = {
        "url": url + "/api/users/" +  urlToName,
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function(data)
    {
        cardContainer = document.getElementById('PodCast-card');

        localStorage.setItem('AuthorEmail', data['email']);
        localStorage.setItem('AuthorSaved', JSON.stringify(data['saved']));

        var Info = 
        {
            "First" : (data['First']),
            "Last" : (data['Last']),
            "Email" : data['email'],
            "Title" : data['title'],
            "Org" : data['org'],
            "disc": data['disc'],
            "tags": data['tags'],
            "following": data['following']
        }
        createAuthorCard(Info);
    });

    initAuthorUploadedPodcasts();
    initAuthorSavedPodcasts();
};

let initTags = () => 
{
    if (cardContainer) 
    {
        document.getElementById('PodCast-card').replaceWith(cardContainer);
        return;
    }

    var settings = {
        "url": url + "/api/keywords",
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function(data)
    {
        cardContainer = document.getElementById('PodCast-card');

        for (let i = 0; i < data.length; i++) 
        {
            var Info = 
            {
                "disc" : data[i]["Disc"],
                "amount" : data[i]["Amount"],
            }

            createDiscCard(Info); 
        }
    });
};

console.log(getCurrentPage());

if (getCurrentPage() == 'details' || getCurrentPage() == 'account')
{
    initUploadedPodcasts();
    initSavedPodcasts();
}
else if (getCurrentPage() == 'search')
{
    initListOfSearchedPodCasts();
}
else if (getCurrentPage() == 'categories')
{
    initDisciplines();
}
else if (getCurrentPage() == '')
{
    initListOfPodCasts();
}
else if (getCurrentPage() == 'keywords')
{
    initTags();
}
else if (getSearch() != "")
    initListOfSearchedPodCasts();
else
    initAuthors();
