//let userDB = 'https://jsonblob.com/api/jsonBlob/953774348607700992';
//let podcastDB = 'https://jsonblob.com/api/jsonBlob/953773366167486464';

let url = "http://localhost:8080";

function seperateByComma(str)
{
    var FirstLength = (str.split(",").length);
    var FirstArray = str.split(",", FirstLength);
    return FirstArray;
}

function setUsername(name)
{
    localStorage.setItem('Username', name);
}

function getUsername()
{
    return localStorage.getItem('Username');
}

function SetIsLoggedIn() 
{
    if (localStorage.getItem('IsLoggedIn') === 'true')
    {
        localStorage.setItem('IsLoggedIn', 'false');
        setUsername("");
    }
    else
        localStorage.setItem('IsLoggedIn', 'true');
}

function CheckIsLoggedIn() 
{
	return localStorage.getItem('IsLoggedIn') === 'true';
}

function LoginCheckDB()
{
    let isUser = false;
    let email = $('#inputEmail').val();
    let pass = $('#inputPassword').val();

    axios({
        method: 'post',
        url: '/api/auth/signin',
        data: {email, pass},
          validateStatus:()=>true
      })
        .then(function (response) 
        {
            console.log(response.data);
            if (response.data["Real"] == true)
            {
                var settings = {
                    "url": url + "/api/account/" + email,
                    "method": "GET",
                    "timeout": 0,
                  };
            
                $.ajax(settings).done(function (data) 
                {
                    //console.log(data);
                    SaveUserData
                    (
                        data['First'], 
                        data['Last'],
                        data['email'],
                        data['org'],
                        data['posts'],
                        data['saved'],
                        data['billing'],
                        data['following']
                    )
                    isUser = true;

                    if (isUser)
                        LogInButtonPress(true);
                    else
                        LogInButtonPress(false);
                });
            }
            else
            {
                alert("Incorrect Login Information");
            }
        })
        .catch(function (error) {
          console.log(error);
        });
}

function UpdateCheckDB(email)
{
    SetIsLoggedIn();
    let isUser = false;

    var settings = {
        "url": url + "/api/account/" + email,
        "method": "GET",
        "timeout": 0,
      };

    $.ajax(settings).done(function(data)
    {
        console.log(data);
        for (let i = 0; i < data.length; i++) 
        {
           if (email == data[i]['email']) 
            {
                SaveUserData
                (
                    data[i]['First'], 
                    data[i]['Last'],
                    data[i]['email'],
                    data[i]['org'],
                    data[i]['posts'],
                    data[i]['saved'],
                    data[i]['billing'],
                )
                isUser = true;
            }
        }
        
        if (isUser)
            ReLogin(true);
        else
            ReLogin(false);

    });
}

function LogInButtonPress(x)
{
    if (CheckIsLoggedIn() === true || x === true)
    {
        SetIsLoggedIn();
        location.href="../";
        console.log("YEP");
    }
    else if (LoginCheckDB() === false || x === false)
    {
        console.log("NOPE");
        alert("Your email or password is incorrect!");
        location.reload();
    }
}

function ReLogin(x)
{
    if (CheckIsLoggedIn() === true || x === true)
    {
        SetIsLoggedIn();
        location.href="/";
        console.log("YEP");
    }
    else if (LoginCheckDB() === false || x === false)
    {
        //console.log("NOPE");
        //alert("Your email or password is incorrect!");
        //location.reload();

        alert("Please log back in to see changes...");
        location.href="/auth";
    }
}

function ShowLogInButton() 
{
    if(CheckIsLoggedIn() === false) 
    {
        $("#LogInButton").show();
        $("#UsernameButton").hide();
        ResetUserData();
    } 
    else 
    {
        $("#LogInButton").hide();
        $("#UsernameButton").show();
        document.getElementById("UsernameButton").innerHTML = getUsername();
    }
}

function SaveUserData(Fname, Lname, email, org, podcasts, saved, billing, following)
{
    setUsername(Fname + " " + Lname);
    localStorage.setItem('Email', email);
    localStorage.setItem('Org', org);
    localStorage.setItem('Podcasts', JSON.stringify(podcasts));
    localStorage.setItem('Saved', JSON.stringify(saved));
    localStorage.setItem('Billing', JSON.stringify(billing));
    localStorage.setItem('Following', JSON.stringify(following));
}

function ResetUserData()
{
    setUsername("");
    localStorage.setItem('Email', "");
    localStorage.setItem('Org', "");
    localStorage.setItem('Podcasts', "");
    localStorage.setItem('Saved', "");
    localStorage.setItem('Billing', "");
}

function ForgotPassword()
{
    // Make sure the user is not logged in
    if (CheckIsLoggedIn())
    {
        location.href="/";
        return 0;
    }

    let isUser = false;
    let email = $('#inputEmail').val();

    var settings = {
        "url": url + "/api/account/forgotpass/" + email,
        "method": "GET",
        "timeout": 0,
      };

    $.ajax(settings).done(function(res)
    {
        console.log(res);
        
        if (res["Real"] == true)
            alert("Password Reset Sent to Email");
        else
            alert("Email does not exist, create account by clicking Register");
    });

}

function Register()
{
    var settings = {
        "url": url + "/api/auth/signup",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "first": $("#registerFinput").val(),
          "last": $("#registerLinput").val(),
          "email": $("#registerEinput").val(),
          "title": $("#registerTinput").val(),
          "org": $("#registerOinput").val(),
          "pass": $("#registerPinput").val(),
          "disc": $("#registerDiscinput").val(),
          "tags": $("#registerTaginput").val()
        }),
      };
      
      $.ajax(settings).done(function (response) 
      {
        if (response["Register"] == false)
        {
            alert("User already exists under that email!");
            return 0;
        }
        else if (response["Register"] == true)
        {
            alert("Registered!");
            location.href="../rules";
            return 0;
        }
      });
}

function RegisterOld()
{

    // Make sure the user is not logged in
    if (CheckIsLoggedIn())
    {
        location.href="index.html";
        return 0;
    }

    // Upload to DB
    let currentUsers = [];
    $.getJSON(userDB, function(data)
    {
        for (let i = 0; i < data.length; i++)
        {
            var Info = 
            {
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "email" : data[i]['email'],
                "title" : data[i]['title'],
                "org" : data[i]['org'],
                "pass" : data[i]['pass'],
                "posts" : data[i]['posts'],
                "saved" : data[i]['saved'],
                "billing" : data[i]['billing'],
                "disc" : data[i]['disc'],
                "tags" : data[i]['tags'],
                "following" : data[i]['following']
            }

            // Make sure its not a duplicate and they actually have filled everything out
            if (data[i]['email'] == $("#registerEinput").val())
            {
                alert("User already exists under that email!");
                return 0;
            }
            else if ($("#registerEinput").val().length < 1)
            {
                alert("Email Required");
                return 0;
            }
            else if ($("#registerPinput").val().length < 1)
            {
                alert("Password Required");
                return 0;
            }

            currentUsers.push(Info);
            console.log(currentUsers);
        }

            console.log(JSON.stringify(currentUsers));

            var Info = 
            {
                "First": $("#registerFinput").val(),
                "Last": $("#registerLinput").val(),
                "email": $("#registerEinput").val(),
                "title": $("#registerTinput").val(),
                "org": $("#registerOinput").val(),
                "pass": $("#registerPinput").val(),
                "posts": [],
                "saved": [],
                "billing": [],
                "disc" : $("#registerDiscinput").val(),
                "tags" : $("#registerTaginput").val(),
                "following" : []
            }

            currentUsers.push(Info);
            console.log(currentUsers);

            console.log(JSON.stringify(currentUsers));

           $.ajax({
                url: userDB,
                type: 'PUT',
                data: JSON.stringify(currentUsers),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("Created");
                location.href="../rules.html";
            });
    });
}

function Upload()
{

    let tempDate = new Date($("#registerPinput").val());
    var dd = String( tempDate.getDate()).padStart(2, '0');
    var mm = String( tempDate.getMonth() + 1).padStart(2, '0');
    var yyyy =  tempDate.getFullYear();
    //console.log(tempDate);
    var Info = 
    {
        "First" : $("#registerFinput").val(),
        "Last" : $("#registerLinput").val(),
        "email" : $("#registerEinput").val(),
        "article_title" : $("#registerTinput").val(),
        "desc" : $("#registerDescinput").val(),
        "journal" : $("#registerOinput").val(),
        "day" : dd,
        "month" : mm,
        "year" : yyyy,
        "doi" : $("#registerDinput").val(),
        "keywords" : $("#registerKinput").val(),
        "file" : $("#registerIinput").val(),
        "rating" : [5],
        "disc" : $("#registerDiscinput").val(),
        "tags" : $("#registerTaginput").val(),
        "url" : $("#registerURLinput").val()
    }

    var first = $("#registerFinput").val();
    var last = $("#registerLinput").val()
    var email = $("#registerEinput").val();
    var article_title = $("#registerTinput").val();
    var desc = $("#registerDescinput").val();
    var journal = $("#registerOinput").val();
    var day = dd;
    var month = mm;
    var year = yyyy;
    var doi = $("#registerDinput").val();
    var keywords = $("#registerKinput").val();
    var disc = $("#registerDiscinput").val();
    var tags = $("#registerTaginput").val();
    var url1 = $("#registerURLinput").val();

    var settings = {
        "url": url + "/api/podcasts",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "first": first,
          "last": last,
          "email": email,
          "title": article_title,
          "desc": desc,
          "journal": journal,
          "day": day,
          "month": month,
          "year": year,
          "doi": doi,
          "keywords": keywords,
          "disc": disc,
          "tags": tags,
          "url": url1
        }),
      };
      
      $.ajax(settings).done(function (response) 
      {
        if (response["Created"] == true)
        {
            console.log("Uploaded");
            alert("Uploaded Podcast");
        }
      });
}

function UploadOld()
{
    // Make sure th user is logged in before allowing to upload
    if (!CheckIsLoggedIn())
    {
        location.href="login.html";
        return 0;
    }

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(podcastDB, function(data)
    {
        for (let i = 0; i < data.length; i++)
        {
            var Info = 
            {
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "email" : data[i]['email'],
                "article_title" : data[i]['article_title'],
                "desc" : data[i]['desc'],
                "journal" : data[i]['journal'],
                "day" : data[i]['day'],
                "month" : data[i]['month'],
                "year" : data[i]['year'],
                "doi" : data[i]['doi'],
                "keywords" : data[i]['keywords'],
                "file" : data[i]['file'],
                "rating" : data[i]['rating'],
                "disc" : data[i]['disc'],
                "tags" : data[i]['tags'],
                "url" : data[i]['url']
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

    console.log(JSON.stringify(currentPodcasts));

            let tempDate = new Date($("#registerPinput").val());
            var dd = String( tempDate.getDate()).padStart(2, '0');
            var mm = String( tempDate.getMonth() + 1).padStart(2, '0');
            var yyyy =  tempDate.getFullYear();
            //console.log(tempDate);
            var Info = 
            {
                "First" : $("#registerFinput").val(),
                "Last" : $("#registerLinput").val(),
                "email" : $("#registerEinput").val(),
                "article_title" : $("#registerTinput").val(),
                "desc" : $("#registerDescinput").val(),
                "journal" : $("#registerOinput").val(),
                "day" : dd,
                "month" : mm,
                "year" : yyyy,
                "doi" : $("#registerDinput").val(),
                "keywords" : $("#registerKinput").val(),
                "file" : $("#registerIinput").val(),
                "rating" : [5],
                "disc" : $("#registerDiscinput").val(),
                "tags" : $("#registerTaginput").val(),
                "url" : $("#registerURLinput").val()
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);

            console.log(JSON.stringify(currentPodcasts));

            $.ajax({
                url: podcastDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("Uploaded");
                //location.href="../index.html";
				alert("Uploaded Podcast");
            });
        });
}

function Rate(title, rating)
{
    var settings = {
        "url": url + "/api/podcasts/" + title + "/actions/like",
        "method": "PATCH",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "rating": rating
        }),
      };
      
      $.ajax(settings).done(function (response) 
      {
        if (response["Liked"] == true)
        {
            console.log("Rated!");
            alert("Thanks for your rating!");
        }
      });
}

function RateOld(doi, rating)
{

    // Make sure th user is logged in before allowing to upload
    if (!CheckIsLoggedIn())
    {
        location.href="login.html";
        return 0;
    }

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(podcastDB, function(data)
    {
        for (let i = 0; i < data.length; i++)
        {
            let curRating = data[i]['rating'];
            if (doi == data[i]['doi'])
                curRating.push(rating);

            var Info = 
            {
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "email" : data[i]['email'],
                "article_title" : data[i]['article_title'],
                "desc": data[i]['desc'],
                "journal" : data[i]['journal'],
                "day" : data[i]['day'],
                "month" : data[i]['month'],
                "year" : data[i]['year'],
                "doi" : data[i]['doi'],
                "keywords" : data[i]['keywords'],
                "file" : data[i]['file'],
                "rating" : curRating,
                "disc": data[i]['disc'],
                "tags": data[i]['tags'],
                "url": data[i]['url'],
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

            $.ajax({
                url: podcastDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("Rated!");
                alert("Thanks for your rating!");
            });
        });
}

function updateSaved()
{
    if (CheckIsLoggedIn())
    {
        var settings = {
            "url": url + "/api/users/" +  getUsername() + "/podcasts/saves",
            "method": "GET",
            "timeout": 0,
        };
        
        var Bookmarks = 0;
        $.ajax(settings).done(function(data)
        {
            for (let i = 0; i < data.length; i++)
            {
                if (localStorage.getItem('Email') /* == data[i]['email'] */)
                    localStorage.setItem("Saved", JSON.stringify(data));
            }
        });
    }
}

function checkSaved(doi)
{
    updateSaved();
    if (localStorage.getItem('Saved').length > 0)
    {
        let savedArray = JSON.parse(localStorage.getItem('Saved'));
        for (let j = 0; j < savedArray.length; j++)
        {
            if (doi == savedArray[j])
                return true;
        }
        return false;
    }
}

function updateFollowed()
{
    var settings = {
        "url": url + "/api/account/" + localStorage.getItem('Email'),
        "method": "GET",
        "timeout": 0,
    };
    
    $.ajax(settings).done(function(data)
    {
            if (localStorage.getItem('Email') == data['email'])
                localStorage.setItem("Following", JSON.stringify(data['following']));
    });
}

function checkFollowed(name)
{
    updateFollowed();
    if (localStorage.getItem('Following').length > 0)
    {
        let savedArray = JSON.parse(localStorage.getItem('Following'));
        for (let j = 0; j < savedArray.length; j++)
        {
            if (name == savedArray[j])
                return true;
        }
        return false;
    }
}

function checkBookmarks(doi)
{
    /*
    //$.ajaxSetup({ async: false });

    var settings = {
        "url": url + "/api/podcasts/" +  doi + "/saves",
        "method": "GET",
        "timeout": 0,
    };
    
    var Bookmarks = 0;
    $.ajax(settings).done(function(data)
    {
        Bookmarks = data;
    });
    //$.ajaxSetup({ async: true });
    return Bookmarks;
    */

    return 0;
}

function Save(title)
{
    var settings = {
        "url": url + "/api/podcasts/" + title + "/actions/subscribe",
        "method": "PATCH",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "email": localStorage.getItem('Email')
        }),
      };
      
      $.ajax(settings).done(function (response) {
        if (response["Saved"] == true)
        {
            console.log("Saved Changed!");
            updateSaved();
            alert("Save Changed!");
        }
      });
}

function SaveOld(doi)
{

    // Make sure th user is logged in before allowing
    if (!CheckIsLoggedIn())
    {
        location.href="auth/login.html";
        return 0;
    }

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(userDB, function(data)
    {
        for (let i = 0; i < data.length; i++)
        {
            // Create and save podcast in array
            let curSaved = data[i]['saved'];
            if (localStorage.getItem('Email') == data[i]['email'] && !checkSaved(doi))
                curSaved.push(doi);

            var Info = 
            {
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "email" : data[i]['email'],
                "title" : data[i]['title'],
                "org" : data[i]['org'],
                "pass" : data[i]['pass'],
                "posts" : data[i]['posts'],
                "saved" : curSaved,
                "billing" : data[i]['billing'],
                "disc" : data[i]['disc'],
                "tags" : data[i]['tags'],
                "following" : data[i]['following']
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

            $.ajax({
                url: userDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("Saved");
                updateSaved();
                alert("Podcast Saved!");
                location.reload();
            });
        });
}

function Follow(name)
{
        // Make sure th user is logged in before allowing
        if (!CheckIsLoggedIn())
        {
            location.href="auth/login.html";
            return 0;
        }
    
        var userEmail = localStorage.getItem('Email');

        var settings = {
            "url": url + "/api/users/" +  name + "/actions/follow",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
              },
              "data": JSON.stringify({
                "email": userEmail
              }),
        };
        
        $.ajax(settings).done(function(data)
        {
            if (data["Following"] == true)
            {
                console.log("Followed");
                updateFollowed();
                alert("User Followed!");
                location.reload();
            }
            else if (data["Following"] == false)
            {
                console.log("UnFollowed");
                updateFollowed();
                alert("User UnFollowed!");
                location.reload();
            }
        });
}

function FollowOld(name)
{

    // Make sure th user is logged in before allowing
    if (!CheckIsLoggedIn())
    {
        location.href="auth/login.html";
        return 0;
    }

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(userDB, function(data)
    {
        for (let i = 0; i < data.length; i++)
        {
            // Create and save podcast in array
            let curSaved = data[i]['following'];
            if (localStorage.getItem('Email') == data[i]['email'] && !checkSaved(name))
                curSaved.push(name);

            var Info = 
            {
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "email" : data[i]['email'],
                "title" : data[i]['title'],
                "org" : data[i]['org'],
                "pass" : data[i]['pass'],
                "posts" : data[i]['posts'],
                "saved" : data[i]['saved'],
                "billing" : data[i]['billing'],
                "disc" : data[i]['disc'],
                "tags" : data[i]['tags'],
                "following" : curSaved
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

            $.ajax({
                url: userDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("Followed");
                updateFollowed();
                alert("User Followed!");
                location.reload();
            });
        });
}

function ArrayRemove(array, value) 
{   
    let newArray = [];
    for (let i = 0; i < array.length; i++)
    {
        if (array[i] != value)
            newArray.push(array[i]);
    }
    return newArray
}

function UnSave(doi)
{

    // Make sure th user is logged in before allowing
    if (!CheckIsLoggedIn())
    {
        location.href="auth/login.html";
        return 0;
    }

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(userDB, function(data)
    {
        for (let i = 0; i < data.length; i++)
        {
            // remove saved podcast in array
            let curSaved = data[i]['saved'];
            if (localStorage.getItem('Email') == data[i]['email'] && checkSaved(doi))
                curSaved = ArrayRemove(curSaved, doi);

            var Info = 
            {
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "email" : data[i]['email'],
                "title" : data[i]['title'],
                "org" : data[i]['org'],
                "pass" : data[i]['pass'],
                "posts" : data[i]['posts'],
                "saved" : curSaved,
                "billing" : data[i]['billing'],
                "disc" : data[i]['disc'],
                "tags" : data[i]['tags'],
                "following" : data[i]['following']
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

            $.ajax({
                url: userDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("Removed Saved Podcast");
                updateSaved();
                alert("Podcast UnSaved!");
                location.reload();
            });
        });
}

function UnFollow(name)
{

    // Make sure th user is logged in before allowing
    if (!CheckIsLoggedIn())
    {
        location.href="auth/login.html";
        return 0;
    }

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(userDB, function(data)
    {
        for (let i = 0; i < data.length; i++)
        {
            // remove saved podcast in array
            let curSaved = data[i]['following'];
            if (localStorage.getItem('Email') == data[i]['email'] && checkFollowed(name))
                curSaved = ArrayRemove(curSaved, name);

            var Info = 
            {
                "First" : data[i]['First'],
                "Last" : data[i]['Last'],
                "email" : data[i]['email'],
                "title" : data[i]['title'],
                "org" : data[i]['org'],
                "pass" : data[i]['pass'],
                "posts" : data[i]['posts'],
                "saved" : data[i]['saved'],
                "billing" : data[i]['billing'],
                "disc" : data[i]['disc'],
                "tags" : data[i]['tags'],
                "following" : curSaved
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

            $.ajax({
                url: userDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("Unfollowed");
                updateFollowed();
                alert("User Unfollowed");
                location.reload();
            });
        });
}

function EditInfo()
{
    // Make sure th user is logged in before allowing
    if (!CheckIsLoggedIn())
    {
        location.href="auth/login.html";
        return 0;
    }

    let FirstChange = false;
    let LastChange = false;
    let PassChange = false;
    let EmailChange = false;
    let DiscChange = false;
    let TagChange = false;
    let TitleChange = false;
    let OrgChange = false;
    let CardChange = false;
    let AddChange = false;


    if ($("#registerFinput").val().length != "")
        FirstChange = true;
    else if ($("#registerLinput").val().length != "")
        LastChange = true;
    else if ($("#registerPinput").val().length != "")
        PassChange = true;
    else if ($("#registerEinput").val().length != "")
        EmailChange = true;
    else if ($("#registerDiscinput").val().length != "")
        DiscChange = true;
    else if ($("#registerTaginput").val().length != "")
        TagChange = true;
    else if ($("#registerTinput").val().length != "")
        TitleChange = true;
    else if ($("#registerOinput").val().length != "")
        OrgChange = true;
    else if ($("#registerCinput").val().length != "")
        CardChange = true;
    else if ($("#registerAinput").val().length != "")
        AddChange = true;

    // Save Info
    let firstSaved = "";
    let lastSaved = "";
    let PassSaved = "";
    let emailSaved = "";
    let titleSaved = "";
    let orgSaved = "";
    let discSaved = "";
    let tagSaved = "";
    let cardSaved = "";
    let addSaved = "";

    // Edit Info

    if (FirstChange)
        firstSaved = $("#registerFinput").val();
    if (LastChange)
        lastSaved = $("#registerLinput").val();
    if (EmailChange)
        emailSaved = $("#registerEinput").val();
    if (DiscChange)
        discSaved = $("#registerDiscinput").val();
    if (TagChange)
        tagSaved = $("#registerTaginput").val();
    if (TitleChange)
        titleSaved = $("#registerTinput").val();
    if (OrgChange)
        orgSaved = $("#registerOinput").val();
    if (CardChange)
        cardSaved = $("#registerCinput").val();
    if (AddChange)
        addSaved = $("#registerAinput").val();

    var settings = {
        "url": url + "/api/account/",
        "method": "PATCH",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "email": localStorage.getItem('Email'),
          "first": firstSaved,
          "last": lastSaved,
          "emailC": emailSaved,
          "title": titleSaved,
          "org": orgSaved,
          "pass": PassSaved,
          "disc": discSaved,
          "tags": tagSaved,
          "card": cardSaved,
          "add": addSaved
        }),
      };
      
      $.ajax(settings).done(function (response) 
      {
        /*if (response["Edited"] == true)
        {
            console.log("updated");
            UpdateCheckDB(localStorage.getItem('Email'));
        }*/

        SetIsLoggedIn();
        alert("Please log back in to see changes...");
        location.href="/auth";
      });

}

function EditInfoOld()
{

    // Make sure th user is logged in before allowing
    if (!CheckIsLoggedIn())
    {
        location.href="auth/login.html";
        return 0;
    }

    let FirstChange = false;
    let LastChange = false;
    let EmailChange = false;
    let DiscChange = false;
    let TagChange = false;
    let TitleChange = false;
    let OrgChange = false;
    let CardChange = false;
    let AddChange = false;

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(userDB, function(data)
    {
        var e;

        for (let i = 0; i < data.length; i++)
        {
            // Check what we are changing and that its not a duplicate
            if (data[i]['email'] == $("#registerEinput").val())
            {
                alert("User already exists under that email!");
                return 0;
            }
            else if ($("#registerFinput").val().length != "")
                FirstChange = true;
            else if ($("#registerLinput").val().length != "")
                LastChange = true;
            else if ($("#registerEinput").val().length != "")
                EmailChange = true;
            else if ($("#registerDiscinput").val().length != "")
                DiscChange = true;
            else if ($("#registerTaginput").val().length != "")
                TagChange = true;
            else if ($("#registerTinput").val().length != "")
                TitleChange = true;
            else if ($("#registerOinput").val().length != "")
                OrgChange = true;
            else if ($("#registerCinput").val().length != "")
                CardChange = true;
            else if ($("#registerAinput").val().length != "")
                AddChange = true;

            // Save Info
            let firstSaved = data[i]['First'];
            let lastSaved = data[i]['Last'];
            let emailSaved = data[i]['email'];
            let titleSaved = data[i]['title'];
            let orgSaved = data[i]['org'];
            let billingSaved = data[i]['billing'];
            let discSaved = data[i]['disc'];
            let tagSaved = data[i]['tags'];

            // Edit Info
            if (localStorage.getItem('Email') == data[i]['email'])
            {
                e = data[i]['email'];

                if (FirstChange)
                    firstSaved = $("#registerFinput").val();
                if (LastChange)
                    lastSaved = $("#registerLinput").val();
                if (EmailChange)
                    emailSaved = $("#registerEinput").val();
                if (DiscChange)
                    discSaved = $("#registerDiscinput").val();
                if (TagChange)
                    tagSaved = $("#registerTaginput").val();
                if (TitleChange)
                    titleSaved = $("#registerTinput").val();
                if (OrgChange)
                    orgSaved = $("#registerOinput").val();
                if (CardChange)
                    cardSaved = $("#registerCinput").val();
                if (AddChange)
                    addSaved = $("#registerAinput").val();
            }

            if (CardChange || AddChange)
            {
                var temp = ["", ""];
                
                if (CardChange)
                    temp[0] = cardSaved;

                if (AddChange)
                    temp[1] = addSaved;

                billingSaved = temp;
            }

            var Info = 
            {
                "First" : firstSaved,
                "Last" : lastSaved,
                "email" : emailSaved,
                "title" : titleSaved,
                "org" : orgSaved,
                "pass" : data[i]['pass'],
                "posts" : data[i]['posts'],
                "saved" : data[i]['saved'],
                "billing" : billingSaved,
                "disc" : discSaved,
                "tags" : tagSaved,
                "following" : data[i]['following']
            }

            if (EmailChange)
                e = emailSaved;

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

            $.ajax({
                url: userDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("updated");
                UpdateCheckDB(e);
                //location.reload();
            });
        });
}

function setAuthor(name)
{
    localStorage.setItem('Author', name);
}

function getAuthor()
{
    return localStorage.getItem('Author');
}

function setEdit(name)
{
    localStorage.setItem('Edit', name);
}

function getEdit()
{
    return localStorage.getItem('Edit');
}

function EditPodcast()
{
    var settings = {
        "url": url + "/api/podcasts/Test",
        "method": "PATCH",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "First" : $("#registerFinput").val(),
            "Last" : $("#registerLinput").val(),
            "email" : $("#registerEinput").val(),
            "article_title" : $("#registerTinput").val(),
            "desc" : $("#registerDescinput").val(),
            "journal" : $("#registerOinput").val(),
            "doi" : $("#registerDinput").val(),
            "keywords" : $("#registerKinput").val(),
            "disc" : $("#registerDiscinput").val(),
            "tags" : $("#registerTaginput").val(),
            "url" : $("#registerURLinput").val()
        }),
      };
      
      $.ajax(settings).done(function (response) 
      {
        if (response["Edited"] == true)
        {
            console.log("updated");
            alert("Podcast Updated");
        }
      });
}

function EditPodcastOld()
{

    // Make sure th user is logged in before allowing
    if (!CheckIsLoggedIn())
    {
        location.href="auth/login.html";
        return 0;
    }

    let FirstChange = false;
    let LastChange = false;
    let EmailChange = false;
    let TitleChange = false;
    let DescChange = false;
    let JournalChange = false;
    let DOIChange = false;
    let KeywordChange = false;
    let DiscChange = false;
    let TagChange = false;
    let URLChange = false;

    // Upload to DB
    let currentPodcasts = [];
    $.getJSON(podcastDB, function(data)
    {
        var e;

        for (let i = 0; i < data.length; i++)
        {
            // Check what we are changing and that its not a duplicate
            if (data[i]['email'] == $("#registerEinput").val())
            {
                alert("User already exists under that email!");
                return 0;
            }
            else if ($("#registerFinput").val().length != "")
                FirstChange = true;
            else if ($("#registerLinput").val().length != "")
                LastChange = true;
            else if ($("#registerEinput").val().length != "")
                EmailChange = true;
            else if ($("#registerTinput").val().length != "")
                TitleChange = true;
            else if ($("#registerDescinput").val().length != "")
                DescChange = true;
            else if ($("#registerOinput").val().length != "")
                JournalChange = true;
            else if ($("#registerDinput").val().length != "")
                DOIChange = true;
            else if ($("#registerKinput").val().length != "")
                KeywordChange = true;
            else if ($("#registerDiscinput").val().length != "")
                DiscChange = true;
            else if ($("#registerTaginput").val().length != "")
                TagChange = true;
            else if ($("#registerURLinput").val().length != "")
                URLChange = true;

            // Save Info
            let firstSaved = data[i]['First'];
            let lastSaved = data[i]['Last'];
            let emailSaved = data[i]['email'];
            let titleSaved = data[i]['article_title'];
            let descSaved = data[i]['desc'];
            let journalSaved = data[i]['journal'];
            let DOISaved = data[i]['doi'];
            let keywordSaved = data[i]['keywords'];
            let discSaved = data[i]['disc'];
            let tagSaved = data[i]['tags'];
            let URLSaved = data[i]['url'];

            // Edit Info
            if (getEdit() == data[i]['doi'])
            {
                if (FirstChange)
                    firstSaved = $("#registerFinput").val();
                if (LastChange)
                    lastSaved = $("#registerLinput").val();
                if (EmailChange)
                    emailSaved = $("#registerEinput").val();
                if (TitleChange)
                    titleSaved = $("#registerTinput").val();
                if (DescChange)
                    descSaved = $("#registerDescinput").val();
                if (JournalChange)
                    journalSaved = $("#registerOinput").val();
                if ( DOIChange)
                    DOISaved = $("#registerDinput").val();
                if (KeywordChange)
                    keywordSaved = $("#registerKinput").val();
                if (DiscChange)
                    discSaved = $("#registerDiscinput").val();
                if (TagChange)
                    tagSaved = $("#registerTaginput").val();
                if (URLChange)
                    URLSaved = $("#registerURLinput").val();
            }

            var Info = 
            {
                "First" : firstSaved,
                "Last" : lastSaved,
                "email" : emailSaved,
                "article_title" : titleSaved,
                "desc" : descSaved,
                "journal" : journalSaved,
                "day" : data[i]['day'],
                "month" : data[i]['month'],
                "year" : data[i]['year'],
                "doi" : DOISaved,
                "keywords" : keywordSaved,
                "file" : data[i]['file'],
                "rating" : data[i]['rating'],
                "disc" : discSaved,
                "tags" : tagSaved,
                "url" : URLSaved
            }

            currentPodcasts.push(Info);
            console.log(currentPodcasts);
        }

            $.ajax({
                url: podcastDB,
                type: 'PUT',
                data: JSON.stringify(currentPodcasts),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (response, status, xhr) 
                {
                    console.log(response);
                },
                error: function (error) 
                {
                    console.log(error);
                }
            }).then(() => 
            {
                console.log("updated");
                alert("Podcast Updated");
                //location.reload();
            });
        });
}