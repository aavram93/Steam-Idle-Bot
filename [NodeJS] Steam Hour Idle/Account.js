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
    // Anzeigend das der Bot Online ist
    bot.setPersonaState(Steam.EPersonaState.Online);
    // Name Wechseln
    bot.setPersonaName('[BOT] RaIN');
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
        if (message == 'hi')
	    bot.sendMessage(user, "Hi, Mein Meister ist leider nicht da aber du kannst ja später wieder kommen :).", Steam.EChatEntryType.ChatMsg);
        if (message == 'hey')
	    bot.sendMessage(user, "Hey, Mein Meister ist leider nicht da aber du kannst ja später wieder kommen :)", Steam.EChatEntryType.ChatMsg);
        if (message == 'na')
	    bot.sendMessage(user, "Na, Mein Meister ist leider nicht da aber du kannst ja später wieder kommen :)", Steam.EChatEntryType.ChatMsg);
        if (message == 'wie gehts')
	    bot.sendMessage(user, "Mir geht es gut, ich muss jetzt wirklich weiter Arbeiten ok?", Steam.EChatEntryType.ChatMsg);
        if (message == 'Wie gehts')
	    bot.sendMessage(user, "Mir geht es gut, ich muss jetzt wirklich weiter Arbeiten ok?", Steam.EChatEntryType.ChatMsg);
        if (message == 'ey')
	    bot.sendMessage(user, "Ey, Mein Meister ist leider nicht da aber du kannst ja später wieder kommen :).", Steam.EChatEntryType.ChatMsg);
        if (message == 'Hi')
	    bot.sendMessage(user, "Hi, Mein Meister ist leider nicht da aber du kannst ja später wieder kommen :).", Steam.EChatEntryType.ChatMsg);
        if (message == 'Hey')
	    bot.sendMessage(user, "Hey, Mein Meister ist leider nicht da aber du kannst ja später wieder kommen :).", Steam.EChatEntryType.ChatMsg);
        if (message == 'Na')
	    bot.sendMessage(user, "Na, Mein Meister ist leider nicht da aber du kannst ja später wieder kommen :).", Steam.EChatEntryType.ChatMsg);
        if (message == 'Ey')
	    bot.sendMessage(user, "Ey! Mein Meister ist leider nicht da aber du kannst ja später wieder kommen.", Steam.EChatEntryType.ChatMsg);
        if (message == 'Wie gehts?')
	    bot.sendMessage(user, "Mir geht es gut, ich muss jetzt wirklich weiter Arbeiten ok?", Steam.EChatEntryType.ChatMsg);
        if (message == 'wie gehts?')
	    bot.sendMessage(user, "Mir geht es gut, ich muss jetzt wirklich weiter Arbeiten ok?", Steam.EChatEntryType.ChatMsg);
        if (message == 'Wie gehts')
	    bot.sendMessage(user, "Mir geht es gut, ich muss jetzt wirklich weiter Arbeiten ok?", Steam.EChatEntryType.ChatMsg);
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
      console.log('[FS] Speichere Sentry auf Festplatte.');
      console.log('[BOT] Sentry gespeichert.');
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
