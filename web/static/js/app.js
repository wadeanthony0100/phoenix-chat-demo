import {Socket, LongPoller} from "phoenix"

class App {

  static init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { })
    })

    socket.connect({user_id: "123"})
    var $status    = $("#status")
    var $messages  = $("#messages")
    var $input     = $("#message-input")
    var $username  = $("#username")

    socket.onOpen( ev => {} )
    socket.onError( ev => {} )
    socket.onClose( e => {})

    var chan = socket.channel("rooms:lobby", {})
    chan.join().receive("ignore", () => {})
      .receive("ok", () => {})
      .after(10000, () => {})
    chan.onError(e => {})
    chan.onClose(e => {})

    $input.off("keypress").on("keypress", e => {
      if (e.keyCode == 13) {
        chan.push("new:msg", {user: $username.val(), body: $input.val()})
        $input.val("")
      }
    })

    chan.on("new:msg", msg => {
      $messages.append(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user || "anonymous")
      $messages.append(`<br/><i>[${username} entered]</i>`)
    })

    /*Add Spam Function*/
    window.spam = (name, msg) => {
      name = name || 'wad'
      msg = msg || 'sup, n00bz?'
      window.setInterval(()=>{
        chan.push("new:msg", {user: name, body: msg});
      }, 200);
    }

  }

  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    return(`<p><a href='#'>[${username}]</a>&nbsp; ${body}</p>`)
  }

}

$( () => App.init() )

export default App
