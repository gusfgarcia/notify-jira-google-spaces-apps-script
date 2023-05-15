function notifyjira(url) {

  var username = 'your.address@here.com';
  var password = 'pwd';
    var token = username + ":" + password;
    var encode = Utilities.base64Encode(token);

    var ops =
    {
        "method": "get",
        "headers":
        {
            "Content-type": "application/json",
            "Authorization": "Basic " + encode
        }
    };

    var url1 = 'https://yourdomainhere.atlassian.net/rest/api/3/search?jql=YOURJQLHERE&startAt=0&maxResults=1';
    var resp = UrlFetchApp.fetch(url1, ops);
    var json = resp.getContentText();
    var data1 = JSON.parse(json);
    var total = Math.ceil(data1.total / 50);

    var n = 0;      

  
 // Jira maintains a request limit, so we'll do it 50 out of 50.


    for (let t = 1; t <= total; t++) {

        var url = 'https://yourdomainhere.atlassian.net/rest/api/3/search?jql=YOURJQLHERE&startAt=' + n + '&maxResults=50';
        var resp = UrlFetchApp.fetch(url, ops);
        var json = resp.getContentText();
        var data = JSON.parse(json);
        var size = Object.keys(data.issues).length

        for (let i = 0; i < size; i++) {


            var key = data.issues[i].key; 
            var summary = data.issues[i].fields.summary; // if you wants to use

      // this if here you can use your own customfield or some field you want.
    
             if(data.issues[i].fields.customfield_12345 != null){
            var YOURCUSTOMFIELD1 = data.issues[i].fields.customfield_12345.value;
            } else{
              var YOURCUSTOMFIELD1 = "";
            } 
          
             if(data.issues[i].fields.customfield_12345 != null){
            var YOURCUSTOMFIELD2 = data.issues[i].fields.customfield_12345.value;
            } else{
              var YOURCUSTOMFIELD2 = "";
            } 

          SendToChat(key, summary, YOURCUSTOMFIELD1, YOURCUSTOMFIELD2)

        }
        n = t * 50;
    }

    function SendToChat(key, summary, YOURCUSTOMFIELD1, YOURCUSTOMFIELD2) {

       const payload = JSON.stringify({
        "cards": [{
            "header": {
                "title": "<B>" + key,
                "subtitle": "<B>" + summary,
                "imageUrl": "https://i.imgur.com/USE YOUR OWN ICON.png",
                "imageStyle": "IMAGE"
            },
            "sections": [{
                "widgets": [{
                    "textParagraph": {
                        "text": "<b>Field:<b> " + YOURCUSTOMFIELD1 +
                            "<br>" + "<b>Field:<b> " + YOURCUSTOMFIELD2,

                    }

                },
                {
                    "buttons": [{
                        "textButton": {
                            "text": "LINK",
                            "onClick": {
                                "openLink": {
                                    "url": "https://yourdomainhere.atlassian.net/browse/" + key
                                }
                            }
                        }
                    }]
                },
                ]
            }]
        }]
    });
    
        const options = {
            method: 'POST',
            contentType: 'application/json',
            payload: payload,
            muteHttpExceptions: true,
        };
    
        const response = UrlFetchApp.fetch('YOUR WEBHOOK FROM GOOGLE HERE', options);
    
        if (response.getResponseCode() != 200) {
            console.error("Failed to send to chat with error: " + response.getContentText());
            return;
        }
    }
} 
