var emailService = require('ffl-email');
var tokenService = require('ffl-services').token.createService();

module.exports = function (data, callback) {
  var league = data.league;

  (function loop (emails) {

      var email = emails.shift();

      if (!email) {
        return callback(null, true);
      }

      var state = {
        email: email,
        league_id: league.id,
        expires_at: moment.utc().add(1, 'd').toISOString()
      };

      var recipient = {email: email};
      var token = tokenService.encrypt(state);

      emailService.sendInvitation(league, recipient, token, function (error) {
        if (error) {
          return callback(error);
        }

        loop(emails);
      });

    } (data.invitees));
};
