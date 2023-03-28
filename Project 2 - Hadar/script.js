$(() => {
  let arr = [];

  $.get("https://api.coingecko.com/api/v3/coins/",
    function (coins) {
      console.log(coins)
      for (const coin of coins) {
        arr.push(coin);
        function displayCoins(coin) {
          $(".coins").append(`         
          <div class="row"  >
          <div class="col-sm-6" >
              <div class="card">
                  <div class="card-body">
                  <img src="${coin.image.small}" id="image class="card-img-top" alt="coin image">
                      <h5 class="card-title">${coin.name}</h5>
                      <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" role="switch" id="${coin.id}">
                      <label class="form-check-label" for="${coin.id}"></label>
                      </div>
                      <p class="card-text">${coin.id}</p>
                      <button id="${coin.id}" type="button" class="btn btn-primary" >More Info</button>
                      <br><br>
                      <div id="${coin.id}" class="in"></div>
                  </div>
              </div>
            </div>
            </div>
        `
          );

          // More Info -----------------------------------------------

          $(`.btn#${coin.id}`).click(function getdata() {
            let time = Date.now()

            if (!localStorage.getItem(coin.id)) {

              if ($(`#${coin.id}.in`).text() == "" || $(`#${coin.id}.in`).is(":hidden")) {

                $.get(`https://api.coingecko.com/api/v3/coins/${this.id}`, function (data) {

                  const details = {
                    img: data.image.small,
                    usd: data.market_data.current_price.usd,
                    eur: data.market_data.current_price.eur,
                    ils: data.market_data.current_price.ils,
                    time: time
                  };
                  localStorage.setItem(data.id, JSON.stringify(details));

                  setTimeout(() => localStorage.removeItem(data.id, JSON.stringify(details)), 120000);

                  $(`#${data.id}.in`).html(`
                 USD:${data.market_data.current_price.usd.toLocaleString("")} $</small>
                EUR:<small class="text-muted"> ${data.market_data.current_price.eur.toLocaleString("")}€</small> 
                ILS:<small class="text-muted"> ${data.market_data.current_price.ils.toLocaleString("")} ₪</small>`);

                  $(`#${data.id}.in`).hide(0);
                  $(`#${data.id}.in`).slideToggle();



                });
              } 
            } 
            else {
              if ($(`#${coin.id}.in`).text() == "") {
                details = JSON.parse(localStorage.getItem(coin.id));
                $(`#${coin.id}.in`).html(`USD:<small class="text-muted"> ${details.usd.toLocaleString()} $</small><br/>
            EUR:<small class="text-muted"> ${details.eur.toLocaleString()} €</small><br/>
            ILS:<small class="text-muted"> ${details.ils.toLocaleString()} ₪</small>`);
                $(`#${coin.id}.in`).hide(0);
                $(`#${coin.id}.in`).slideToggle();
              } 
              else {
                $(`#${coin.id}.in`).slideToggle();
              }
            }
          });
        }
        displayCoins(coin);
      }


      // Search---------------------------

      $("#btn1").click(filter)
      function filter() {
        $(".coins").html("");
        let filtered = arr.filter(
          (coin) => coin.symbol.toLowerCase() == $("input").val().toLowerCase()
        );
        if (filtered.length == 0) {
          $(".coins").append("<h5>Please try again</h5>");
        } else {
          let coin = filtered[0];
          displayCoins(coin);

          for (const i of arr2) {
            $(`.form-check-input#${i.coinid}`).prop("checked", true);
          }
          $(`.form-check-input`).click(chooseCoins)

        }
      };

      $('.form-control').keyup(function (e) {
        if (e.keyCode == 13) {
          filter()
        }
      })

      // check box------------------------
      let arr2 = [];

      $(`.form-check-input`).click(chooseCoins)
      function chooseCoins(e) {

        let coinid = e.target.id;
        let name = $(e.currentTarget).parent().parent().children().first().text();


        if (arr2.length < 5) {
          if (e.target.checked == true) {
            arr2.push({ coinid, name });
          } else {
            arr2 = arr2.filter(coin => coin.coinid != coinid);
            for (const i of arr2) {
              console.log(i.coinid)
            }
          }

        } else {
          if (e.target.checked == false) {
            $(`.form-check-input#${coinid}`).prop("checked", false);
            arr2 = arr2.filter(coin => coin.coinid != coinid);
          } else {
            e.preventDefault();
            $(".changebtn").css("display", "block");

            $("#currentcoin").html(e.target.id);
            $(".canc").click(function () {
              $(".changebtn").css("display", "none");
            });

            $(".FiveCoins").html("");
            for (const item of arr2) {
              $(".FiveCoins").append(
                ` <div class="col-sm-6" style="width:auto; margin:10px"  >
                            <div class="card" id="go" style="width:200px; height:100;">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <div class="form-check form-switch">
                                    <input class="form-check-input indiv" type="checkbox" checked="true" role="switch" id="${item.coinid}">
                                    <label class="form-check-label" for="${item.coinid}"></label>
                                    </div>
                                    <p class="card-text">${item.coinid}</p>
                                    
                                </div>
                            </div>
                          </div>`
              );
            }

            $(`.indiv`).click(function (e) {
              if ($('input[type="checkbox"]:checked')) {
                let id = e.currentTarget.id;
                if (e.target.checked == false) {
                  $(`.form-check-input#${id}`).prop("checked", false);
                  $(`.form-check-input#${coinid}`).prop("checked", true);
                  $(".changebtn").css("display", "none");
                  arr2.push({ coinid, name });
                  arr2 = arr2.filter((e) => e.coinid != id);
                }
              }
            });
          }
        }
      };

      $(".page1").click(() => {
        $(".coins").html("");
        for (const coin of arr) {
          displayCoins(coin);
        }
        for (const i of arr2) {
          $(`.form-check-input#${i.coinid}`).prop("checked", true);
        }
        $(`.form-check-input`).click(chooseCoins)
      });

      // ----------------------------------------------------------

      $(".page2").click(function () {
        if (arr2.length == 0) {
          alert("You need to select coins!")
        }
        // if (arr2.length != 0) {

        //   $(".coins").html("");
        //   $(".coins").append("")
        // }
      })

      // -----------------------------------------------------------

      $(".page3").click(function () {
        $(".coins").html("");
        $(".coins").append(`
      <div class="card mb-3"style="padding:50px; width:50% ">
          <div class="row g-0">
          <div class="col-md-4" >
          <img src="./WhatsApp\ Image\ 2022-04-25\ at\ 03.15.38\ \(1\).jpeg" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
          <div class="card-body">
          <h5 class="card-title">Hadar's Project</h5>
          <br>
          I am doing my best here, so I really hope for success. I love coding 😎
          <br>
          I also go to private lessons,  I work hard to be better. 
          <br></p>
          <p class="card-text">
          This is my second project in my studies at john bryce -full stack developer.
          In my project I used jquery, AJAX Api and Bootstrap.
          <br>
          hope you enjoyed.</p>
          <p class="card-text"><small class="text-muted">Hadar || 23 || Elad.</small></p>
          </div>
          </div>
          </div>
          </div>
      `);
      });
    }
  );
});
