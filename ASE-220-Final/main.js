const open = require('open');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {MongoClient, ObjectId} = require('mongodb');
const port = process.env.PORT || 8080;

const uri = "mongodb+srv://Hunter:giordulloh1@nku.zhise.mongodb.net/ASE220Final?retryWrites=true&w=majority";
const client = new  MongoClient(uri);
const DB = client.db('ASE220Final');

function seperateByComma(str)
{
    var FirstLength = (str.split(",").length);
    var FirstArray = str.split(",", FirstLength);
    return FirstArray;
}

client.connect(function(err,db)
{
	if(err) throw err;
	console.log('Database Connected!');
})

/* Middleware */
app.use(express.static('public'));
app.use(bodyParser.json());

/* Basic WEB Routes */
app.get('/',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./index.html','utf-8'));
})

app.get('/rules',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./rules.html','utf-8'));
})

app.get('/auth',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./auth/login.html','utf-8'));
})

app.get('/podcasts/create',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./podcasts/create.html','utf-8'));
})

app.get('/podcasts/:title/edit',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./podcasts/edit.html','utf-8'));
})

app.get('/podcasts/:title',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./podcast.html','utf-8'));
})

app.get('/users/:name/podcasts/authored',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./authored.html','utf-8'));
})

app.get('/users/:name/podcasts/saved',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./saved.html','utf-8'));
})

app.get('/howtoupload',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./howtoupload.html','utf-8'));
})

app.get('/auth/register',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./auth/register.html','utf-8'));
})

app.get('/account/details',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./account.html','utf-8'));
})

app.get('/account/settings',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./account.html','utf-8'));
})

app.get('/keywords/:tag',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./searchSpec.html','utf-8'));
})

app.get('/categories/:disc',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./searchSpec.html','utf-8'));
})

app.get('/users/:name',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./users.html','utf-8'));
})

app.get('/categories',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./categories.html','utf-8'));
})

app.get('/keywords',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./keywords.html','utf-8'));
})

app.get('/search',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./search.html','utf-8'));
})

app.get('/pages/about',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./pages/about.html','utf-8'));
})

app.get('/pages/contact',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./pages/contact.html','utf-8'));
})

app.get('/pages/faq',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./pages/faq.html','utf-8'));
})

app.get('/pages/pricing',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./pages/pricing.html','utf-8'));
})

app.get('/pages/terms',(req, res)=>
{
	res.status(200).send(fs.readFileSync('./pages/terms.html','utf-8'));
})

/* Data Request Routes */

app.get('/api/',(req, res)=>
{
	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			// Reorganize to Most Recently Posted
			var length = ress.length;
			var goal = 0;
			if (length > 10)
				goal = length - 10;

			let tempArray = [];
			for (let i = length; i > goal; i--)
			{
				tempArray.push(ress[i - 1]);
			}

			res.status(200).json(tempArray);
			data.close();
		});
	});	
})

app.get('/api/all/',(req, res)=>
{
	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);

			res.status(200).json(ress);
			data.close();
		});
	});	
})

app.get('/api/search/keyword/:keyword',(req, res)=>
{
	var keyword = req.params.keyword;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let words = ress[j]["keywords"].toLowerCase();
				if (words.includes(keyword.toLowerCase()))
					newArray.push(ress[j]);
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})



app.get('/api/search/date/:date',(req, res)=>
{
	var date = req.params.date;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let year = ress[j]["year"];
				if (year == date)
					newArray.push(ress[j]);
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

function checkDisc(disc, array)
{
    for (let i = 0; i < array.length; i++)
    {
       if (array[i]["Disc"] == disc)
			return i;
    }
	return -1;
}

app.get('/api/categories',(req, res)=>
{
	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let Discs = seperateByComma(ress[j]["disc"]);
				for (let e = 0; e < Discs.length; e++)
				{
					let Disc = Discs[e];
					if (checkDisc(Disc, newArray) == -1)
						newArray.push({"Disc": Disc, "Amount": 1});
					else
						newArray[checkDisc(Disc, newArray)] = {"Disc": Disc, "Amount": newArray[checkDisc(Disc, newArray)]["Amount"] + 1}
				}
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/categories/:disc',(req, res)=>
{
	var disc = req.params.disc;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let Discs = seperateByComma(ress[j]["disc"]);

				for (let e = 0; e < Discs.length; e++)
				{
					let Disc = Discs[e];
					if (Discs[e].toLowerCase() == disc.toLowerCase())
						newArray.push(ress[j]);
				}
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/categories/:disc/search/keyword/:keyword',(req, res)=>
{
	var disc = req.params.disc;
	var keyword = req.params.keyword;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
			{
				let Discs = seperateByComma(ress[j]["disc"]);

				for (let e = 0; e < Discs.length; e++)
				{
					let Disc = Discs[e];
					if (Discs[e].toLowerCase() == disc.toLowerCase() &&
					ress[j]["keywords"].toLowerCase().includes(keyword.toLowerCase()))
						newArray.push(ress[j]);
				}
			}
	
			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/categories/:disc/search/date/:date',(req, res)=>
{
	var disc = req.params.disc;
	var date = req.params.date;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
			{
				let Discs = seperateByComma(ress[j]["disc"]);

				for (let e = 0; e < Discs.length; e++)
				{
					let Disc = Discs[e];
					if (Discs[e].toLowerCase() == disc.toLowerCase() &&
						ress[j]["year"] == date)
						newArray.push(ress[j]);
				}
			}
	
			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/keywords',(req, res)=>
{
	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let Discs = seperateByComma(ress[j]["keywords"]);
				for (let e = 0; e < Discs.length; e++)
				{
					let Disc = Discs[e];
					if (checkDisc(Disc, newArray) == -1)
						newArray.push({"Disc": Disc, "Amount": 1});
					else
						newArray[checkDisc(Disc, newArray)] = {"Disc": Disc, "Amount": newArray[checkDisc(Disc, newArray)]["Amount"] + 1}
				}
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/keywords/:keyword',(req, res)=>
{
	var keyword = req.params.keyword;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let words = ress[j]["keywords"].toLowerCase();
				if (words.includes(keyword.toLowerCase()))
					newArray.push(ress[j]);
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/keywords/:keyword/search/date/:date',(req, res)=>
{
	var keyword = req.params.keyword;
	var date = req.params.date;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let words = ress[j]["keywords"].toLowerCase();
				if (words.includes(keyword.toLowerCase()) && 
					ress[j]["year"] == date)
					newArray.push(ress[j]);
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.post('/api/podcasts', (req, res) =>
{
	var first = req.body.first;
	var last = req.body.last;
	var email = req.body.email;
	var title = req.body.title;
	var desc = req.body.desc;
	var journal = req.body.journal;
	var day = req.body.day;
	var month = req.body.month;
	var year = req.body.year;
	var doi = req.body.doi;
	var keywords = req.body.keywords;
	var disc = req.body.disc;
	var tags = req.body.tags;
	var url = req.body.url;

	var Info = 
	{
		"First": first,
		"Last": last,
		"email": email,
		"article_title": title,
		"desc": desc,
		"journal": journal,
		"day": day,
		"month": month,
		"year": year,
		"doi": doi,
		"keywords": keywords,
		"file": "",
		"rating": [5],
		"disc" : disc,
		"tags" : tags,
		"url" : url
	}

	console.log(Info);

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);

		DB.collection('podcasts').insertOne((Info),function(err, result)
		{		
			if (err || !result)
				return res.status(500).json({"Created": false});
				
			res.status(200).json({"Created": true});
			data.close();
		})
	});	
})

app.patch('/api/podcasts/:title', (req, res) =>
{
	var TitleP = req.params.title;

	var first = req.body.first;
	var last = req.body.last;
	var email = req.body.email;
	var title = req.body.title;
	var desc = req.body.desc;
	var journal = req.body.journal;
	var day = req.body.day;
	var month = req.body.month;
	var year = req.body.year;
	var doi = req.body.doi;
	var keywords = req.body.keywords;
	var disc = req.body.disc;
	var tags = req.body.tags;
	var url = req.body.url;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);

		DB.collection('podcasts').findOne({article_title: TitleP}, function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);

			if (!first || first == "")
				first = ress["First"];
			if (!last)
				last = ress["Last"];
			if (!email || email == "")
				email = ress["email"];
			if (!title || title == "")
				title = ress["article_title"];
			if (!desc || desc == "")
				desc = ress["desc"];
			if (!journal || journal == "")
				journal = ress["journal"];
			if (!doi || doi == "")
				doi = ress["doi"];
			if (!keywords || keywords == "")
				keywords = ress["keywords"];
			if (!disc || disc == "")
				disc = ress["disc"];
			if (!tags || tags == "")
				tags = ress["tags"];
			if (!url || url == "")
				url = ress["url"];

			var Info = 
			{
				"First": first,
				"Last": last,
				"email": email,
				"article_title": title,
				"desc": desc,
				"journal": journal,
				"day": ress["day"],
				"month": ress["month"],
				"year": ress["year"],
				"doi": doi,
				"keywords": keywords,
				"file": "",
				"rating": [5],
				"disc" : disc,
				"tags" : tags,
				"url" : url
			}

			DB.collection('podcasts').updateOne({article_title: TitleP}, {$set: Info},function(err, result)
			{		
				if (err || !result)
					return res.status(500).json({"Edited": false});
					
				res.status(200).json({"Edited": true});
				data.close();
			});
		});
	});	
})

app.delete('/api/podcasts/:title', (req, res) =>
{
	var title = req.params.title;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);

		DB.collection('podcasts').deleteOne({article_title: title},function(err, result)
		{		
			if (err || !result)
				return res.status(500).json({"Deleted": false});
				
			res.status(200).json({"Deleted": true});
			data.close();
		})
	});	
})

app.get('/api/podcasts/:title',(req, res)=>
{
	var title = req.params.title;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').findOne({article_title: title}, function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);

			res.status(200).json(ress);
			data.close();
		});
	});	
})

app.patch('/api/podcasts/:title/actions/subscribe', (req, res) =>
{
	var title = req.params.title;
	var email = req.body.email;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').findOne({article_title: title}, function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);

			var doi = parseInt(ress["doi"]);

			DB.collection('users').findOne({email: email}, function(err, resss)
			{
				if (resss["saved"].find(e => e % doi == 0))
				{
					DB.collection('users').updateOne({email: email}, {$pull:{"saved": doi}},function(err, result)
					{	
						if (err || !result)
							return res.status(500).json({"Saved": false});

						res.status(200).json({"Saved": true});
						data.close();
					});
				}
				else
				{
					DB.collection('users').updateOne({email: email}, {$push:{"saved": doi}},function(err, result)
					{	
						if (err || !result)
							return res.status(500).json({"Saved": false});

						res.status(200).json({"Saved": true});
						data.close();
					});
				}
			});

			//res.status(200).json({"Liked": false});
			//data.close();
		});
	});	
})

app.patch('/api/podcasts/:title/actions/like', (req, res) =>
{
	var title = req.params.title;
	var rating = req.body.rating;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
			{
				let words = ress[j]["article_title"];
				if (words == title)
					newArray.push(ress[j]);
			}

			console.log(newArray[0]["rating"]);

			let tempArray = [];
			for (let j = 0; j < newArray[0]["rating"].length; j++)
			{
				tempArray.push(newArray[0]["rating"][j]);
			}
			tempArray.push(rating);

			console.log(tempArray);

			var newid = newArray[0]["_id"].toString();

			DB.collection('podcasts').updateOne({_id: new ObjectId(newid)}, {$set:{"rating": tempArray}},function(err, result)
			{	
				if (err || !result)
					return res.status(500).json({"Liked": false});

				res.status(200).json({"Liked": true});
				data.close();
			})

			//res.status(200).json({"Liked": false});
			//data.close();
		});
	});	
})

app.post('/api/auth/signin', (req, res) =>
{
	var email = req.body.email;
	var pass = req.body.pass;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({email: email, pass: pass}, function(err, ress)
		{
			if (err || !ress)
				return res.status(500).json({"Real": false});

			res.status(200).json({"Real": true});
			data.close();
		});
	});	
})

app.post('/api/auth/signup', (req, res) =>
{
	var first = req.body.first;
	var last = req.body.last;
	var email = req.body.email;
	var pass = req.body.pass;
	var title = req.body.title;
	var org = req.body.org;
	var disc = req.body.disc;
	var tags = req.body.tags;

	var Info = 
	{
		"First": first,
		"Last": last,
		"email": email,
		"title": title,
		"org": org,
		"pass": pass,
		"posts": [],
		"saved": [],
		"billing": [],
		"disc" : disc,
		"tags" : tags,
		"following" : []
	}

	console.log(Info);

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({email: email}, function(err, ress)
		{
			if (err || ress)
				return res.status(403).json({"Register": false});

				DB.collection('users').insertOne((Info),function(err, result)
				{		
					if (err || !result)
						return res.status(500).json({"Register": false});
						
					res.status(200).json({"Register": true});
					data.close();
				})

			//res.status(200).json({"Register": true});
			//data.close();
		});
	});	
})

// Returns amount of saves that podcast has
app.get('/api/podcasts/:doi/saves',(req, res) =>
{
	var doi = req.params.doi;

	var Bookmarks = 0;
	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').find({}).toArray(function(err, ress)
		{
			if(err || !ress) 
				return res.status(500).json(err);

			for (let i = 0; i < ress.length; i++) 
			{
				let saved;
				if (ress[i]["saved"] == null)
					saved = 0;
				else
					saved = Object.keys(ress[i]["saved"]).length;

				for (let j = 0; j < saved; j++)
				{
				if (ress[i]["saved"][j] == doi)
						Bookmarks++;
				}
			}

			res.status(200).json(Bookmarks);
			data.close();
		});
	});	
})

app.get('/api/users/:name/podcasts/authored',(req, res) =>
{
	var name = req.params.name;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);
			
			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let words = seperateByComma(ress[j]["First"].toLowerCase());
				let words1 = seperateByComma(ress[j]["Last"].toLowerCase());

				for (let i = 0; i < words.length; i++)
				{
					if (words[i] + " " + words1[i] == name.toLowerCase())
						newArray.push(ress[j]);
				}
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/users/:name/podcasts/saves',(req, res) =>
{
	var name = req.params.name;
	var names = name.split(" ");

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({First: names[0], Last: names[1]}, function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);

			let newArray = [];
			for (let j = 0; j < ress["saved"].length; j++)
			{
					newArray.push(ress["saved"][j]);
			}

			DB.collection('podcasts').find({}).toArray(function(err, ress)
			{
				if(err) 
					return res.status(500).json(err);
				
				let Array = [];
				for (let j = 0; j < ress.length; j++)
				{
					let DOI = ress[j]["doi"];
					if (newArray.find(e => e % DOI == 0))
						Array.push(ress[j]);
				}

				res.status(200).json(Array);
				data.close();
			});

			//res.status(200).json(newArray);
			//data.close();
		});
	});	
})

app.get('/api/users/:name', (req, res) =>
{
	var name = req.params.name;
	var names = name.split(" ");

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({First: names[0], Last: names[1]}, function(err, ress)
		{
			if(err || !ress) 
				return res.status(500).json(err);

			// Don't Return Password or Billing Info
			let newArray = ress;
			newArray["pass"] = "";
			newArray["billing"] = [];

			res.status(200).json(ress);
			data.close();
		});
	});	
})

app.post('/api/users/:name/actions/follow', (req, res) =>
{
	var name = req.params.name;
	var email = req.body.email;
	var names = name.split(" ");

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({email: email}, function(err, ress)
		{

			if(err) 
				return res.status(500).json(err);

			let Following = ress["following"];
			var isFollowing = false;
			for (let i = 0; i < Following.length; i++)
			{
				if (Following[i] == name)
					isFollowing = true;
			}

			//console.log(Following);

			if (!isFollowing)
				Following.push(name);
			else
			{
				let tempArray = [];
				for (let i = 0; i < Following.length; i++)
				{
					if (Following[i] == name) {}
					else
					{
						tempArray.push(Following[i])
					}
				}	
				Following = tempArray;
			}
			

			//console.log(Following);

			DB.collection('users').updateOne({email: email}, {$set:{"following": Following}},function(err, result)
			{	
				//console.log(result);	
				if (err)
					return res.status(500).json(err);

				//console.log("Patched");

				if (!isFollowing)
					res.status(200).json({"Following": true});
				else
					res.status(200).json({"Following": false});
			})

			//res.status(500).json();
			//data.close();
		});
	});	
})

app.get('/api/users/:name/podcasts/authored',(req, res)=>
{
	var name = req.params.name;
	var names = name.split(" ");

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('podcasts').find({}).toArray(function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);

			let newArray = [];
			for (let j = 0; j < ress.length; j++)
            {
				let wordsF = ress[j]["First"].toLowerCase();
				let wordsL = ress[j]["Last"].toLowerCase();
				if (wordsF.includes(names[0].toLowerCase()) &&
					wordsL.includes(names[1].toLowerCase()))
					newArray.push(ress[j]);
            }

			res.status(200).json(newArray);
			data.close();
		});
	});	
})

app.get('/api/account/forgotpass/:email', (req, res) =>
{
	var email = req.params.email;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({email: email}, function(err, ress)
		{
			if(err || !ress) 
				return res.status(500).json({"Real" : false});

			res.status(200).json({"Real" : true});
			data.close();
		});
	});	
})

app.get('/api/account/:email', (req, res) =>
{
	var email = req.params.email;

	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({email: email}, function(err, ress)
		{
			if(err) 
				return res.status(500).json(err);

			res.status(200).json(ress);
			data.close();
		});
	});	
})

app.patch('/api/account/', (req, res) =>
{
	var email = req.body.email;

	var first = req.body.first;
	var last = req.body.last;
	var emailC = req.body.emailC;
	var pass = req.body.pass;
	var title = req.body.title;
	var org = req.body.org;
	var disc = req.body.disc;
	var tags = req.body.tags;
	var card = req.body.card;
	var add = req.body.add;

	
	client.connect(function(err, data)
	{
		if(err) 
			return res.status(500).json(err);
		
		DB.collection('users').findOne({email: email}, function(err, ress)
		{

			if(err) 
				return res.status(500).json(err);	
				
				if (first == "")
					first = ress["First"]
				if (last == "")
					last = ress["Last"]
				if (emailC == "")
					emailC = ress["email"]
				if (pass == "")
					pass = ress["pass"]
				if (title == "")
					title = ress["title"]
				if (org == "")
					org = ress["org"]
				if (disc == "")
					disc = ress["disc"]
				if (tags == "")
					tags = ress["tags"]	
				if (card == "")
					card = ress["billing"][0]
				if (add == "")
					add = ress["billing"][1]

				var Info = 
				{
					"First": first,
					"Last": last,
					"email": emailC,
					"title": title,
					"org": org,
					"pass": pass,
					"posts": ress["posts"],
					"saved": ress["saved"],
					"billing": [card, add],
					"disc" : disc,
					"tags" : tags,
					"following" : ress["following"]
				}

			console.log(Info);

			DB.collection('users').updateOne({email: email}, {$set:Info},function(err, result)
			{	
				//console.log(result);	
				if (err)
					return res.status(500).json(err);

				console.log(Info);

				res.status(200).json({"Edited": true});
			})

			//res.status(200).json({"Edited": true});
			//res.status(500).json();
			//data.close();
		});
	});	
	
})

app.listen(port,async() => {
  console.log(`Backend listening on port ${port}`);
  await open(`http://localhost:${port}`);
})
