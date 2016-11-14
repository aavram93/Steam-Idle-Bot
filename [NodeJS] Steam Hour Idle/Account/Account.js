var Steam = require('steam');
var fs = require('fs');
var bot = new Steam.SteamClient();

// Sentry Funktion
if (fs.existsSync('sentryfile'))
{
    var sentry = fs.readFileSync('sentryfile');
    console.log('[BOT] Mit Sentry Anmelden.');
    bot.logOn({
      //Steam Acount Name
      accountName: '',
      //Steam Account Passwort
      password: '',
      shaSentryfile: sentry
    });
}
else
{
    console.log('[BOT] Ohne Sentry Anmelden.');
    bot.logOn({
      //Steam Acount Name
      accountName: '',
      //Steam Account Passwort
      password: '',
      //Steam Guard Code
      authCode: ''
    });
}

bot.on('loggedOn', function() {
    console.log('[BOT] Erfolgreich Angemeldet.');
    // Anzeigen das der Bot Online ist
    bot.setPersonaState(Steam.EPersonaState.Online);
    // Name Wechseln
    bot.setPersonaName('Just a Bot');
    // Spiele die der Bot "Farmen" soll. (APP IDs Angeben!)
    bot.gamesPlayed([10,80,240,730,440]);
    // Beispiele:
    // Counter-Strike 1.6                           10
    // Counter-Strike: Condition Zero               80
    // Counter-Strike: Source                      240
    // Counter-Strike: Global Offensive            730
    // Team Fortress 2                             440
});

// Automatisches Anmelden falls nicht Eingeloggt (Standart: Prüfe jede 2 Minuten)
bot.on('setInterval', function() {
    if(!bot.loggedOn) {
        bot.logOn(userInfo);
    }
}, (2 * 60 * 1000));

// Bot beenden STRG+C
process.on('SIGINT', function() {
    if(bot.loggedOn) {
        console.log("[BOT] Abgemeldet");
        console.log("[BOT] Beendet!");
        bot.logOff();
    }
    process.exit(0);
});

// Automatisches Nachricht Antwortsystem
bot.on('friendMsg', function(user, message, type) {
    if(type = Steam.EChatEntryType.ChatMsg) {
        // Zeige Chat Nachrichten im CMD Fenster
        var now = new Date();
        console.log(now.toLocaleTimeString() + ": " + user + ": " + message);
        
        // Speichere Chat Nachrichten in Text Datei
        fs.appendFile("Nachrichten.txt", user + ": " + message + "\n");
        
        // Automatische Nachricht Senden
	var IncomingMessage = message.toString();
	    
        if (IncomingMessage == "")
	{
			
	}
	else
	{
		bot.sendMessage(user, "Grad am Botten, schreib mich bitte später wieder an", Steam.EChatEntryType.ChatMsg);
	}
    }
});

// Sentry
bot.on('sentry', function(sentryHash)
{ 
    console.log('[BOT] Sentry erhalten.');
    fs.writeFile('sentryfile',sentryHash,function(err) {
    if(err){
      console.log(err);
    } else {
      console.log('[BOT] Speichere Sentry auf Festplatte.');
      console.log('[BOT] Sentry gespeichert.');
      console.log('[BOT] Bot gestartet.');
    }});
});

// Verhalten bei Fehlern
bot.on('error', function(e) {
console.log('[BOT] Fehler - Login Fehlgeschlagen');
    if (e.eresult == Steam.EResult.InvalidPassword)
    {
    console.log('Grund: Falsches Passwort');
    }
    else if (e.eresult == Steam.EResult.AlreadyLoggedInElsewhere)
    {
    console.log('Grund: Bereits auf einem anderem Gerät Angemeldet');
    }
    else if (e.eresult == Steam.EResult.AccountLogonDenied)
    {
    console.log('Grund: Steam Guard Code erforderlich');
    }
})
