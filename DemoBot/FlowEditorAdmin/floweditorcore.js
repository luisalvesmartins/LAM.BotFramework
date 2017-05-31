var UserInput = {
    ElementSelected: -1,
    ElementBSelected: -1,
    LinkSelected: -1,
    dX: -1,
    dY: -1,
    lastX: null,
    lastY: null,
    moving: false,
    drawing: false,
    getCoordinates: function () {
        var x = event.clientX + cnvContainer.scrollLeft - cnv.offsetLeft;
        var y = event.clientY + cnvContainer.scrollTop - cnv.offsetTop;
        return { x: x, y: y };
    },
    mousemove: function () {
        if (!this.drawing) {
            this.drawing = true;

            if (UserInput.ElementSelected != -1 && UserInput.moving) {
                var mouse = UserInput.getCoordinates();

                if (mouse.x != UserInput.lastX || mouse.y != UserInput.lastY) {
                    Cnv.Draw();
                    Cnv.Nodes[UserInput.ElementSelected].selectElement(Cnv.ctx);

                    //console.log("Moving:" + UserInput.ElementSelected)
                    Cnv.Nodes[UserInput.ElementSelected].x = mouse.x - UserInput.dX;
                    Cnv.Nodes[UserInput.ElementSelected].y = mouse.y - UserInput.dY;

                    UserInput.lastX = mouse.x;
                    UserInput.lastY = mouse.y;
                }
            }
            if (UserInput.ElementBSelected != -1) {
                var mouse = UserInput.getCoordinates();

                if (mouse.x != UserInput.lastX || mouse.y != UserInput.lastY) {
                    Cnv.Draw();
                    Cnv.Nodes[UserInput.ElementBSelected].selectElement(Cnv.ctx);

                    CanvasHelper.drawArrow(Cnv.ctx, UserInput.dX, UserInput.dY, mouse.x, mouse.y, "black");
                    //console.log("Moving:" + UserInput.ElementSelected)

                    UserInput.lastX = mouse.x;
                    UserInput.lastY = mouse.y;
                }
            }
            this.drawing = false;
        }
        event.preventDefault();
    },
    mousedown: function () {
        var mouse = UserInput.getCoordinates();
        var iE = Cnv.FindSelectedElement(mouse.x, mouse.y);
        var i = iE.I;
        var b = iE.B;

        if (b != -1) {
            UserInput.dX = Cnv.Nodes[b].centerX();
            UserInput.dY = Cnv.Nodes[b].y + Cnv.Nodes[b].height + 5;

            Cnv.Nodes[b].selectElement(Cnv.ctx);

            UserInput.ElementBSelected = b;
        }
        //console.log("hit:" + i)
        if (i != -1) {
            UserInput.dX = mouse.x - Cnv.Nodes[i].x;
            UserInput.dY = mouse.y - Cnv.Nodes[i].y;

            Cnv.Nodes[i].selectElement(Cnv.ctx);
            SideBar.Draw(i);

            UserInput.ElementSelected = i;
            UserInput.moving = true;
        }
        else {
            SideBar.HideElemDiv();

            UserInput.moving = false;
            UserInput.ElementSelected = -1;

            for (var i = 0; i < Cnv.Links.length; i++) {
                if (Cnv.Links[i].segmentTouch(mouse.x, mouse.y)) {
                    //if (Cnv.Nodes[Cnv.Links[i].from].sub == Cnv.CurrentSub) {
                        Cnv.Links[i].DrawSegments(Cnv.ctx);
                        SideBar.DrawLink(i);
                        UserInput.LinkSelected = i;
                        break;
                    //}
                }
            }
        }
        event.preventDefault();
    },
    mouseup: function () {
        var b = false;
        UserInput.moving = false;
        //UserInput.ElementSelected=-1;
        if (UserInput.ElementBSelected != -1) {
            //DROP CONNECTION
            var mouse = UserInput.getCoordinates();
            var iE = Cnv.FindSelectedElement(mouse.x, mouse.y);
            if (iE.I != -1) {
                Cnv.Links[Cnv.Links.length] = new Link(UserInput.ElementBSelected, iE.I, "");
                UserInput.LinkSelected = Cnv.Links.length;
                b = true;
            }
            else {
            }
            UserInput.ElementBSelected = -1;
        }
        if (UserInput.ElementSelected != -1) {
            var colliding = true;
            var mx = 0;
            while (colliding) {
                colliding = false;
                for (var i = 0; i < Cnv.Nodes.length; i++) {
                    if (i != UserInput.ElementSelected && Cnv.Nodes[i].sub == Cnv.CurrentSub) {
                        var a = GeoMath.checkRectangleIntersectionObj(Cnv.Nodes[UserInput.ElementSelected], Cnv.Nodes[i]);
                        if (a) {
                            colliding = true;
                            if (mx == 0) {
                                if (Cnv.Nodes[UserInput.ElementSelected].centerX() < Cnv.Nodes[i].centerX()) {
                                    mx = -10;
                                }
                                else {
                                    mx = 10;
                                }
                            }
                            Cnv.Nodes[UserInput.ElementSelected].x += mx;
                            if (Cnv.Nodes[UserInput.ElementSelected].x < 0) {
                                Cnv.Nodes[UserInput.ElementSelected].x = 0;
                                UserInput.ElementSelected = i;
                                mx = 10;
                            }
                            break;
                        }
                    }
                }
            }
            var round = 5;
            Cnv.Nodes[UserInput.ElementSelected].x = round * Math.round(Cnv.Nodes[UserInput.ElementSelected].x / round); 
            Cnv.Nodes[UserInput.ElementSelected].y = round * Math.round(Cnv.Nodes[UserInput.ElementSelected].y / round); 
        }
        Cnv.Draw();
        if (UserInput.ElementSelected != -1)
            Cnv.Nodes[UserInput.ElementSelected].selectElement(Cnv.ctx);
        else
            SideBar.HideElemDiv();
        if (b)
            SideBar.DrawLink(UserInput.LinkSelected);
    },
    keyup: function () {
        switch (event.keyCode) {
            case 45:
                var nodename = "NODE" + Cnv.Nodes.length;
                var nx = 30 + cnvContainer.scrollLeft;
                var ny = 30 + cnvContainer.scrollTop;
                Cnv.NodesAdd(nx, ny, 200, 30, "Edit this text", "Text", Cnv.CurrentSub, nodename, "");
                Cnv.Draw();
                break;
            case 46:
                if (UserInput.ElementSelected != -1) {
                    if (event.srcElement.id.indexOf("prop") == -1) {
                        SideBar.DeleteElement();
                    }
                }
                if (UserInput.LinkSelected != -1) {
                    if (event.srcElement.id.indexOf("prop") == -1) {
                        SideBar.DeleteLink();
                    }
                }
                break;
            default:
        }
    }

}

var SideBar = {
    DrawLink: function (i) {
        SideBar.HideElemDiv();
        divlink.style.display = "block";
        prop_linktext.value = Cnv.Links[i].text;
    },
    LinkTextChange: function () {
        Cnv.Links[UserInput.LinkSelected].text = prop_linktext.value;
        Cnv.Links[UserInput.LinkSelected].cached = false;
        Cnv.Draw();
    },
    Draw: function (i) {
        prop_id.value = i;
        prop_q.value = Cnv.Nodes[i].text;
        prop_type.value = Cnv.Nodes[i].type;
        prop_nodename.value = Cnv.Nodes[i].name;
        prop_options.value = Cnv.Nodes[i].options;
        prop_lang.value = Cnv.Nodes[i].langdet;
        if (Cnv.Nodes[i].bypass != "Yes")
            prop_bypass.value = "No";
        else
            prop_bypass.value = Cnv.Nodes[i].bypass;
        SideBar.DrawDetail();
        SideBar.HideLinkDiv();
    },
    TypeChange: function () {
        SideBar.DrawDetail();
        SideBar.Save();
    },
    DrawDetail: function () {
        //var i = prop_id.value;
        var propType = prop_type.value;
        propqtext.innerHTML = "Question";
        $("#butTypeWiz").hide();
        $("#butTypeWiz").hide();
        $("#propdivsub").hide();
        $("#propdivq").show();
        $("#propdivnodename").show();
        $("#propdivoptions").hide();

        $("#divpreview").show();
        $("#propdivlang").show();
        $("#propdivbypassnode").show();
        switch (propType) {
            case "AdaptiveCard":
                propqtext.innerHTML = "Card Definition";
                $("#propdivoptions").show();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
                break;
            case "AdaptiveCardShow":
                propqtext.innerHTML = "Card Definition";
                $("#propdivnodename").hide();
                $("#propdivoptions").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
                break;
            case "Attachment":
                $("#propdivlang").hide();
                $("#propdivoptions").show();
                $("#propdivbypassnode").hide();
                break;
            case "API":
                propqtext.innerHTML = "URL";
                $("#propdivnodename").hide();
                $("#divpreview").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
                break;
            case "Choice":
                $("#propdivoptions").show();
                break;
            case "ChoiceAction":
                $("#propdivoptions").show();
                $("#propdivbypassnode").hide();
                break;
            case "EndSub":
                //prop_sub
                prop_q.value = "";
                $("#divpreview").hide();
                $("#propdivsub").hide();
                $("#propdivq").hide();
                $("#propdivnodename").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
            case "Expression":
                propqtext.innerHTML = "Expression";
                $("#propdivnodename").hide();
                $("#divpreview").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
                break;
            case "LUIS":
                $("#butTypeWiz").show();
                break;
            case "Message":
                propqtext.innerHTML = "Message";
                $("#propdivnodename").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
                break;
            case "MessageEnd":
                propqtext.innerHTML = "Message";
                $("#propdivnodename").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
                break;
            case "QnAMaker":
                $("#butTypeWiz").show();
                break;
            case "Search":
                $("#butTypeWiz").show();
                break;
            case "SUB":
                //prop_sub
                $("#divpreview").hide();
                $("#propdivsub").show();
                $("#propdivq").hide();
                $("#propdivnodename").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();

                var x = document.getElementById("prop_sub");
                while (x.length > 0)
                    x.remove(0);
                for (var f = 0; f < Cnv.Regions.length; f++) {
                    var option = document.createElement("option");
                    option.text = Cnv.Regions[f];
                    option.value = option.text;
                    x.add(option);
                }
                x.value = prop_q.value;
                break;
            case "ResetAllVars":
                prop_q.value = "";
                $("#propdivq").hide();
                $("#propdivnodename").hide();
                $("#propdivlang").hide();
                $("#propdivbypassnode").hide();
                break;
        }
        SideBar.Preview(prop_q.value, propType)
        $("#divwizardmain").show();
    },
    TypeWiz: function () {
        switch ($("#prop_type").val()) {
            case 'LUIS':
                var stId = prompt("Please enter LUIS id (GUID)", "");
                var stSK = prompt("Please enter LUIS subscription-key (string)", "");
                //$('#prop_options').val("id=" + stId + "&subscription-key=" + stSK);
                $('#prop_options').val(stId + "?subscription-key=" + stSK);
                break;
            case 'Search':
                var o = null;
                try {
                    o = JSON.parse($('#prop_options').val().replace(/'/g, '"'));
                } catch (e) {
                    o = { ServiceName: "", Key: "", Index: "", FieldQ: "", FieldA: "", QSearch: "" };
                }

                var stSN = prompt("Please enter AzureSearch ServiceName (string)", o.ServiceName);
                var stSK = prompt("Please enter AzureSearch Key (string)", o.Key);
                var stIn = prompt("Please enter AzureSearch Index (string)", o.Index);
                var stQ = prompt("Please enter AzureSearch FieldQ (string)", o.FieldQ);
                var stA = prompt("Please enter AzureSearch FieldA (string)", o.FieldA);
                var stQS = prompt("Please enter QSearch (string,leave blank if you don't know how to use,it enables automatic search based on a previous variable)", o.QSearch);
                $('#prop_options').val("{'ServiceName':'" + stSN + "', 'Key':'" + stSK + "', 'Index':'" + stIn + "', 'FieldQ':'" + stQ + "','FieldA':'" + stA + "', 'QSearch':'" + stQS + "', 'MaxResults':'3'}");
                break;
            case 'QnAMaker':
                var q = null;
                try {
                    q = JSON.parse($('#prop_options').val().replace(/'/g, '"'));
                } catch (e) {
                    q = { KBId: "", Key: "", MinScore: "3", QSearch: "", NotFoundMessage: "Did not find an Answer to your Question" };
                }

                var stId = prompt("Please enter QnAMaker Id (GUID)", q.KBId);
                var stSK = prompt("Please enter QnAMaker Key (string)", q.Key);
                var stMS = prompt("Please enter MinScore (string)", q.MinScore);
                var stQS = prompt("Please enter QSearch (string,leave blank if you don't know how to use,it enables automatic search based on a previous variable)", q.QSearch);
                var stNF = prompt("Please enter NotFound Message (string)", q.NotFoundMessage);
                $('#prop_options').val("{'KBId':'" + stId + "', 'Key':'" + stSK + "', 'MinScore':'" + stMS + "', 'QSearch':'" + stQS + "', 'NotFoundMessage':'" + stNF + "'}");
                break;
        }
        SideBar.Save();
    },
    HideElemDiv: function () {
        divwizardmain.style.display = "none";
        divpreview.style.display = "none";
    },
    HideLinkDiv: function () {
        divlink.style.display = "none";
    },
    DeleteElement: function () {
        //DELETE LINKS
        for (var i = 0; i < Cnv.Links.length; i++) {
            if (Cnv.Links[i].from == UserInput.ElementSelected || Cnv.Links[i].to == UserInput.ElementSelected) {
                Cnv.Links.splice(i, 1);
                i--;
            }
        }
        //REORDER LINKS
        for (var i = 0; i < Cnv.Links.length; i++) {
            if (Cnv.Links[i].to >= UserInput.ElementSelected) {
                Cnv.Links[i].to--;
            }
            if (Cnv.Links[i].from >= UserInput.ElementSelected) {
                Cnv.Links[i].from--;
            }
        }

        //DELETEELEMENT
        Cnv.Nodes.splice(UserInput.ElementSelected, 1);
        Cnv.Draw();
        SideBar.HideElemDiv();
    },
    DeleteLink: function () {
        Cnv.Links.splice(UserInput.LinkSelected, 1);
        Cnv.Draw();
        SideBar.HideLinkDiv();
    },
    Preview: function (msg, type) {
        prev_user.innerHTML = type;
        var msgUser = "ok";
        switch (type) {
            case 'Integer':
                msgUser = "10";
                break;
            case 'Choice':
                var o = Cnv.Nodes[prop_id.value].options
                var os = o.split(',');
                for (var i = 0; i < os.length; i++) {
                    msg += "<div class=prevbutton>" + os[i] + "</div>";
                    msgUser = os[i];
                }
                break;
            case 'ChoiceAction':
                for (var i = 0; i < Cnv.Links.length; i++) {
                    if (Cnv.Links[i].from == prop_id.value) {
                        msg += "<div class=prevbutton>" + Cnv.Links[i].text + "</div>";
                        msgUser = Cnv.Links[i].text;
                    }
                }
                break;
            case 'LUIS':
                for (var i = 0; i < Cnv.Links.length; i++) {
                    if (Cnv.Links[i].from == prop_id.value) {
                        msgUser = Cnv.Links[i].text;
                        break;
                    }
                }
                break;
            case 'Message':
                msgUser = "(no response needed)";
                break;
            case 'MessageEnd':
                msgUser = "(no response needed)";
                break;
            case 'SUB':
                msgUser = "no preview";
                msg = "no preview"
                break;
        }
        prev_user.innerHTML = msgUser;
        if (msg.indexOf("{") == 0) {
            msg = "hero card";
        }
        prev_bot.innerHTML = msg;
    },
    Save: function () {
        $("#butTypeWiz").hide();
        switch ($("#prop_type").val()) {
            case "LUIS":
                $("#butTypeWiz").show();
                break;
            case "QnAMaker":
                $("#butTypeWiz").show();
                break;
            case "Search":
                $("#butTypeWiz").show();
                break;
            default:

        }

        Cnv.Nodes[prop_id.value].text = $("#prop_q").val();
        Cnv.Nodes[prop_id.value].cached = false;
        Cnv.Nodes[prop_id.value].type = $("#prop_type").val();
        Cnv.Nodes[prop_id.value].options = $("#prop_options").val();
        Cnv.Nodes[prop_id.value].langdet = $("#prop_lang").val();
        Cnv.Nodes[prop_id.value].bypass = $("#prop_bypass").val();
        Cnv.Draw();
    },
    TextChange: function () {
        SideBar.Save();
    },
    PropChange: function () {
        Cnv.Nodes[prop_id.value].name = prop_nodename.value;
        Cnv.Nodes[prop_id.value].options = prop_options.value;
    }
}

var Cnv = {
    ctx: null,
    Nodes: new Array(),
    Links: new Array(),
    CurrentSub: "main",
    Regions: new Array(),

    FindSelectedElement: function (x, y) {
        for (var i = 0; i < this.Nodes.length; i++) {
            if (this.Nodes[i].sub == this.CurrentSub) {
                if (this.Nodes[i].inside(x, y)) {
                    return { I: i, A: -1, B: -1 };
                }
                if (this.Nodes[i].insideB(x, y)) {
                    return { I: -1, A: -1, B: i };
                }
            }
        }
        return { I: -1, A: -1, B: -1 };
    },
    Drawing: false,
    Draw: function () {
        if (!this.Drawing) {
            this.Drawing = true;
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.strokeStyle = "black";
            this.ctx.beginPath();
            this.ctx.stroke();
            //console.log("LINKS:" + this.Links.length)
            for (var i = 0; i < this.Links.length; i++) {
                if (this.Nodes[this.Links[i].from].sub == this.CurrentSub)
                    this.Links[i].draw(this.ctx);
            }

            for (var i = 0; i < this.Nodes.length; i++) {
                if (this.Nodes[i].sub == this.CurrentSub)
                    this.Nodes[i].draw(this.ctx);
            }

            this.Drawing = false;
        }
    },
    NodesAdd: function (x, y, width, height, text, type, sub, name, options) {
        this.Nodes[this.Nodes.length] = new Node(x, y, width, height, text, type, sub, name, options);
    },
    TabMenu: function (selected) {
        var sT = "";
        for (var i = 0; i < this.Regions.length; i++) {
            var r = this.Regions[i];
            if (r == selected)
                sT += "<a href='#' class='tabsel' onclick=\"Menu.Draw('" + r + "')\">" + r + "</a>";
            else
                sT += "<a href='#' class='tabunsel' onclick=\"Menu.Draw('" + r + "')\">" + r + "</a>";
        }
        sT += "<a href='#' class='tabunsel' onclick=\"Menu.Draw('+')\">+</a>";
        tabs.innerHTML = sT;
    },
    Init: function (CanvasElement, flow) {
        var canvas = document.getElementById(CanvasElement);
        this.ctx = canvas.getContext("2d");

        this.Regions = ["main"];
        var a = '[{\"q\":\"Hello! I\'m the Savings Bot\",\"max\":\"\",\"var\":\"\",\"type\":\"Message\",\"options\":\"Option1,Option2,Option3\",\"nextq\":\"\"},{\"q\":\"How much money do you want to invest?\",\"max\":\"100000000\",\"var\":\"q1\",\"type\":\"Integer\",\"options\":\"A,B,C,D\",\"nextq\":\"\"},{\"q\":\"For how long? (years)\",\"max\":\"100\",\"var\":\"time\",\"options\":\"\",\"type\":\"Integer\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"Do you want to withdraw money during that period?\",\"max\":\"\",\"var\":\"empty\",\"options\":\"Yes,No\",\"type\":\"Choice\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"Do you plan to add money to the savings?\",\"max\":\"\",\"var\":\"empty\",\"options\":\"Yes,No\",\"type\":\"Choice\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"The best options for you savings are:\",\"max\":\"\",\"var\":\"\",\"options\":\"\",\"type\":\"Message\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"(list of options that would appear from a query to the bank product list)\",\"max\":\"\",\"var\":\"empty\",\"options\":\"\",\"type\":\"Message\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"Do you want to start your savings now?\",\"max\":\"\",\"var\":\"empty\",\"options\":\"Yes,No\",\"type\":\"ChoiceAction\",\"nexq\":\"\",\"nextq\":\"[{\\"intent\\":\\"Yes\\",\\"q\\":8},{\\"intent\\":\\"No\\",\\"q\\":12}]\"},{\"q\":\"Are you our customer already?\",\"max\":\"\",\"var\":\"empty\",\"options\":\"Yes,No\",\"type\":\"ChoiceAction\",\"nexq\":\"\",\"nextq\":\"[{\\"intent\\":\\"Yes\\",\\"q\\":\\"9\\"},{\\"intent\\":\\"No\\",\\"q\\":\\"10\\"}]\"},{\"q\":\"(authenticate client)\",\"max\":\"\",\"var\":\"empty\",\"options\":\"\",\"type\":\"Message\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"(show link for products page)\",\"max\":\"\",\"var\":\"empty\",\"options\":\"\",\"type\":\"Message\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"Thank you, have a nice day\",\"max\":\"\",\"var\":\"empty\",\"options\":\"\",\"type\":\"MessageEnd\",\"nexq\":\"\",\"nextq\":\"\"},{\"q\":\"Thank you, have a nice day\",\"max\":\"\",\"var\":\"\",\"type\":\"Message\",\"options\":\"\"}]';

        if (flow != undefined) {
            var data = JSON.parse(flow);
            var y = 20;
            for (var c = 0; c < data.length; c++) {
                var b = data[c];
                var region = b.sub;
                if (region != undefined && region != null) {
                    if (this.Regions.indexOf(region) == -1) {
                        this.Regions[this.Regions.length] = region;
                        console.log("R:" + region)
                    }
                }
                else
                    region = "main";

                var name = b.node;
                if (b.node == null || b.node == undefined) {
                    if (b.var == null || b.var == undefined || b.var == "") {
                        name = "A" + c;
                    }
                    else
                        name = b.var;
                }

                var xx = b.x;
                var yy = b.y;
                var ww = b.width;
                var hh = b.height;
                if (xx == null) {
                    xx = 30;
                    yy = y;
                    ww = 200;
                    hh = 30;
                }
                var text = b.text;
                if (!(b.q == null || b.q == undefined)) {
                    text = b.q;
                }
                this.NodesAdd(xx, yy, ww, hh, text, b.type, region, name, b.options);
                y += this.Nodes[this.Nodes.length - 1].height + 20;
            }
            var b = data;
            for (var i = 0; i < b.length; i++) {
                var s = b[i].nextq + "";
                if (s == "" || s == null || s == undefined || s == "undefined") {
                    if (b[i].type != "MessageEnd") {
                        if (i + 1 < this.Nodes.length)
                            this.Links[this.Links.length] = new Link(i, i + 1, "");
                    }
                }
                else {
                    if (s.indexOf("{") > 0) {
                        s = s.replace(/'/g, '\"');
                        var v = JSON.parse(s);
                        for (var j = 0; j < v.length; j++) {
                            this.Links[this.Links.length] = new Link(i, v[j].q, v[j].intent);
                        }
                    }
                    else {
                        if (s != "-1") {
                            console.log("L:" + i + ">" + parseInt(s))
                            this.Links[this.Links.length] = new Link(i, parseInt(s), "");
                        }
                    }
                }
            }
            console.log("Nodes:" + Cnv.Nodes.length)

        }

        this.TabMenu("main");

        //JsonB=JSON.parse(a);
        this.Draw();
        //var y=20;
        //for(var i=1;i<b.length;i++){
        //	y+=this.Nodes[i-1].height+20;
        //	this.Nodes[i].y=y;
        //}


        //this.Links[this.Links.length]=new Link(1,2,"Yes");
        //this.Links[this.Links.length]=new Link(1,3,"No");
    }
}
var Link = function (from, to, text) {
    this.cached = false;
    this.cnv = null;
    this.tCtx = null;
    this.from = from;
    this.to = to;
    this.text = text;
    this.textWidth = 0;
    this.xt = 0;
    this.yt = 0;
    this.segments = new Array();
    this.draw = function (ctx) {
        this.segments = new Array();
        var x1 = Cnv.Nodes[this.from].centerX();
        var y1 = Cnv.Nodes[this.from].y + Cnv.Nodes[this.from].height;

        var x2 = Cnv.Nodes[this.to].centerX();
        var y2 = Cnv.Nodes[this.to].centerY();
        var y3 = Cnv.Nodes[this.to].y;

        y2 = Cnv.Nodes[this.to].y;

        this.xt = (x1 + x2) / 2;
        this.yt = (y1 + y2) / 2;

        if (y2 > y1) {
            var ym = (y1 + y2) / 2;
            if (Cnv.Nodes[this.from].DDownNode == this.to) {
                Cnv.Nodes[this.from].DDown = ym;
            }
            else {
                if (ym < Cnv.Nodes[this.from].DDown) {
                    Cnv.Nodes[this.from].DDown = ym;
                    Cnv.Nodes[this.from].DDownNode = this.to;
                }
                else {
                    ym = Cnv.Nodes[this.from].DDown;
                }
            }
            if (ym < y1 && ym < y2) {
                ym = (y1 + y1) / 2;
                Cnv.Nodes[this.from].DDown = ym;
            }
            this.yt = ym - 20;
            this.segmentAdd(x1, y1, x1, ym, "v");
            this.segmentAdd(x1, ym, x2, ym, "h");
            this.segmentAdd(x2, ym, x2, y2, "v");
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, ym);
            ctx.lineTo(x2, ym);
            //ctx.lineTo(x2,y2);
            ctx.stroke();
            CanvasHelper.drawArrow(ctx, x2, ym, x2, y2, "black");
        }
        else {
            if (Cnv.Nodes[this.from].DDownNode == this.to)
                Cnv.Nodes[this.from].DDown = 1000;


            ctx.strokeStyle = "blue";
            ctx.beginPath();
            //DOWN
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y1 + 20);
            //ctx.lineTo(x1,ym);
            this.segmentAdd(x1, y1, x1, y1 + 20, "v");

            //LEFT CALC
            var y3 = y2 - 20;
            var x3 = Cnv.Nodes[this.to].x - 20;
            if (Cnv.Nodes[this.from].x - 20 < x3)
                x3 = Cnv.Nodes[this.from].x - 20;

            if (Cnv.Nodes[this.from].DUpNode == this.to) {
                Cnv.Nodes[this.from].DUp = x3;
            }
            else {
                if (x3 < Cnv.Nodes[this.from].DUp) {
                    Cnv.Nodes[this.from].DUp = ym;
                    Cnv.Nodes[this.from].DUpNode = this.to;
                }
                else {
                    x3 = Cnv.Nodes[this.from].DUp;
                }
            }

            if (Cnv.Nodes[this.to].x > Cnv.Nodes[this.from].x + Cnv.Nodes[this.from].width) {
                x3 = (x2 + x1) / 2;
            }

            this.xt = x3 + 20;
            this.yt = y3 - 20;

            //left
            this.segmentAdd(x1, y1 + 20, x3, y1 + 20, "h");
            //up
            this.segmentAdd(x3, y1 + 20, x3, y3, "v");
            //right
            this.segmentAdd(x3, y3, x2, y3, "h");
            //Down
            this.segmentAdd(x2, y3, x2, y2, "v");

            ctx.lineTo(x3, y1 + 20);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x2, y3);
            ctx.stroke();
            CanvasHelper.drawArrow(ctx, x2, y3, x2, y2, "black");
        }

        if (!this.cached) {
            if (this.text != "") {
                var textHeight = 20;
                this.cnv = document.createElement("canvas");
                this.tCtx = this.cnv.getContext("2d");

                this.tCtx.font = "10pt Verdana";
                this.textWidth = this.tCtx.measureText(this.text).width;

                this.height = CanvasHelper.wrapTextGetHeight(this.tCtx, this.text, this.textWidth, textHeight);

                this.cnv.width = this.textWidth;
                this.cnv.height = this.height;
                this.tCtx.font = "10pt Verdana";
                CanvasHelper.Text(this.tCtx, 0, 0, this.textWidth, textHeight, this.text, "left", textHeight);
            }
            this.cached = true;
        }
        //this.DrawSegments(ctx);
        if (this.text != "")
            ctx.drawImage(this.tCtx.canvas, x2 - this.textWidth/2, y3 - 30);
    }
    this.segmentAdd = function (x1, y1, x2, y2, d) {
        this.segments[this.segments.length] = { x1: x1, y1: y1, x2: x2, y2: y2, d: d };
    }
    this.DrawSegments = function (ctx) {
        ctx.strokeStyle = "green";
        ctx.moveTo(this.segments[0].x1, this.segments[0].y1);
        for (var i = 0; i < this.segments.length; i++) {
            ctx.lineTo(this.segments[i].x2, this.segments[i].y2);
        }
        ctx.stroke();
    }
    this.segmentTouch = function (x, y) {
        var d = 3;
        for (var i = 0; i < this.segments.length; i++) {
            if (this.segments[i].d == "h") {
                if (((x >= this.segments[i].x1 - d && x <= this.segments[i].x2 + d) ||
                 (x >= this.segments[i].x2 - d && x <= this.segments[i].x1 + d)) && Math.abs(this.segments[i].y1 - y) < d) {
                    return true;
                }
            }
            else {
                if (((y >= this.segments[i].y1 - d && y <= this.segments[i].y2 + d) ||
                    (y >= this.segments[i].y2 - d && y <= this.segments[i].y1 + d))
                    && Math.abs(this.segments[i].x1 - x) < d)
                    return true;
            }
        }
        return false;
    }
}
var Node = function (x, y, width, height, text, type, sub, name, options) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.type = type;
    this.sub = sub;
    this.name = name;
    this.options = options;
    this.bypass = "No";
    this.langdet = "Yes";

    this.DDown = 1000;
    this.DDownNode = -1;
    this.DUp = 1000;
    this.DUpNode = -1;

    this.cnv = null;
    this.tCtx = null;
    this.cached = false;

    this.centerX = function () { return this.x + this.width / 2; };
    this.centerY = function () { return this.y + this.height / 2; };
    this.inside = function (mx, my) {
        if (mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height)
            return true;
        else
            return false;
    }
    this.insideB = function (mx, my) {
        var d = 5;
        var d2 = 5, d2x2 = d2 * 2;
        var x2 = this.x + this.width / 2
        //console.log (mx + ">=" + (x2-d) + " " + mx +  "<=" + (x2+d))
        //console.log( my + ">=" + (this.y-d+this.height) + " " + my + "<=" + (this.y+d+this.height));
        if (mx >= x2 - d && mx <= x2 + d && my >= this.y - d + this.height && my <= this.y + d + this.height) {
            return true;
        }
        else
            return false;
    }
    this.selectElement = function (ctx) {
        var d = 5;
        var d2 = 5, d2x2 = d2 * 2;
        var x2 = this.x + this.width / 2
        ctx.strokeStyle = "red";
        ctx.rect(this.x - d, this.y - d, this.width + d * 2, this.height + d * 2);

        //ctx.rect(x2-d2,this.y-d2-d, d2x2, d2x2);
        //if (this.DDownNode==-1)
        ctx.rect(x2 - d, this.y + this.height - d2 + d, d2x2, d2x2);
        ctx.stroke();
    }
    this.statDraw = function (ctx, n) {
        var x = this.x - 10;
        var y = this.y - 5;
        ctx.fillStyle = "black";
        ctx.fillRect(x + 1, y + 1, 30, 20);
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(x, y, 30, 20);

        //CanvasHelper.rect(ctx, x, y, x+30,y+20, "lightgray", "gray");
        ctx.fillStyle = "white";
        ctx.font = "10pt Verdana";
        CanvasHelper.Text(ctx, x, y, 30, 20, n, "center", 20);
    }
    this.draw = function (ctx) {
        if (!this.cached) {
            var Hheader = 10;

            var textHeight = 20;
            this.cnv = document.createElement("canvas");
            this.tCtx = this.cnv.getContext("2d");

            this.tCtx.font = "10pt Verdana";
            var sText = this.text;
            if (sText.length > 1) {
                if (sText.substr(0, 1) == "{") {
                    sText = sText.replace(/'/g, '\"');
                    var H = JSON.parse(sText);
                    sText = H.title;
                }
            }

            var color = "white";
            var colorText = "#000000";
            switch (this.type) {
                case "AdaptiveCard":
                    color = "#EE1010";
                    colorText = "white";
                    sText = "CARD(EDIT)";
                    break;
                case "AdaptiveCardShow":
                    color = "#EE1010";
                    colorText = "white";
                    sText = "CARD";
                    break;
                case "API":
                    color = "brown";
                    colorText = "white";
                    sText = "CODE";
                    this.width = 100;
                    break;
                case "Attachment":
                    color = "brown";
                    colorText = "white";
                    sText = "CODE";
                    break;
                case "ChoiceAction":
                    color = "#2f83bd";
                    colorText = "white";
                    break;
                case "Choice":
                    color = "#39a2eb";
                    colorText = "white";
                    break;
                case "Expression":
                    color = "gray";
                    colorText = "white";
                    break;
                case "SUB":
                    color = "cornflowerblue";
                    colorText = "white";
                    break;
                case "EndSub":
                    color = "green";
                    colorText = "white";
                    break;
                case "LUIS":
                    color = "darkcyan";
                    colorText = "white";
                    break;
                case "Message":
                    color = "#e0e0e0";
                    colorText = "black";
                    break;
                case "MessageEnd":
                    color = "salmon";
                    colorText = "white";
                    break;
                case "ResetAllVars":
                    color = "cornflowerblue";
                    colorText = "white";
                    break;
                default:

            }
            this.height = Hheader * 2 + CanvasHelper.wrapTextGetHeight(this.tCtx, sText, this.width - 20, textHeight);

            this.cnv.width = this.width;
            this.cnv.height = this.height;
            this.tCtx.font = "10pt Verdana";
            this.tCtx.fillStyle = "lightgray";
            this.tCtx.fillRect(0, 0, this.width, this.height);

            var cornerRadius = 4;
            this.tCtx.lineJoin = "round";
            this.tCtx.lineWidth = cornerRadius;

            this.tCtx.fillStyle = color;
            this.tCtx.strokeStyle = color;

            // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
            this.tCtx.strokeRect(4 + (cornerRadius / 2), 4 + (cornerRadius / 2), this.width - 8 - cornerRadius, 16 - cornerRadius);
            this.tCtx.fillRect(6 + (cornerRadius / 2), 6 + (cornerRadius / 2), this.width - 10 - cornerRadius, 14 - cornerRadius);

            //this.tCtx.fillRect(2,2, this.width-4, 18);
            this.tCtx.fillStyle = colorText;
            CanvasHelper.Text(this.tCtx, 2, 2, this.width - 4, 20, this.type, "center", textHeight);

            this.tCtx.fillStyle = "#000000";
            CanvasHelper.rect(this.tCtx, 0, 0, this.width, this.height, "lightgray", "gray");

            CanvasHelper.Text(this.tCtx, 10, Hheader * 2, this.width - 10, this.height, sText, "wrap", textHeight);
            this.cached = true;
        }
        ctx.drawImage(this.tCtx.canvas, this.x, this.y);
    }
}

var Phrases = {
    Add: function () {
        phraseslist.innerHTML = phraseslist.innerHTML + "<input type='text'/>";
    }
}

var Scenario = {
    Select: function () {
        var select = $("#scenarios").val();
        $.get("/api/Conversation/Index?type=" + select, function (data) {
            if (data != "") {
                Cnv.Nodes = new Array();
                Cnv.Links = new Array();
                Cnv.Regions = ["main"];
                Cnv.TabMenu("main");

                Cnv.Init("cnv", data);
                Cnv.Draw();
            }
            else {
                alert("NO SCENARIO LOADED YET");
            }
        });
        $('#divload').hide();
    },
    LoadSelect: function () {
        $.get("/api/Conversation/Index?type=", function (data) {
            var a = data;
            var select = $("#scenarios");

            var options = select.prop('options');
            $('option', select).remove();
            options[options.length] = new Option("Select...", "");

            for (var i = 0; i < a.length; i++) {
                options[options.length] = new Option(a[i], a[i]);
            }
        });
    },
    showStat: function () {
        $.get("/api/Log/LoadScenario?scenario=" + SCENARIOCODE + "&dateStart=&dateFinish=", "", function (data, textStatus, jqXHR) {
            for (var i = 0; i < data.length; i++) {
                if (Cnv.Nodes[data[i].key].sub == Cnv.CurrentSub)
                    Cnv.Nodes[data[i].key].statDraw(Cnv.ctx, data[i].value);
            }
        })
    },
    LoadJson: function () {
        var data = $("#loadJS").val();
        Cnv.Nodes = new Array();
        Cnv.Links = new Array();
        Cnv.Regions = ["main"];
        Cnv.TabMenu("main");

        Cnv.Init("cnv", data);
        Cnv.Draw();

        $('#divload').hide();
    },
    Transform: function () {
        var NL = new Array();
        for (var i = 0; i < Cnv.Nodes.length; i++) {
            var n = {
                x: Cnv.Nodes[i].x,
                y: Cnv.Nodes[i].y,
                width: Cnv.Nodes[i].width,
                height: Cnv.Nodes[i].height,
                q: Cnv.Nodes[i].text,
                type: Cnv.Nodes[i].type,
                node: Cnv.Nodes[i].name,
                sub: Cnv.Nodes[i].sub,
                options: Cnv.Nodes[i].options,
                langdet: Cnv.Nodes[i].langdet,
                bypass: Cnv.Nodes[i].bypass
            }
            var NQ = new Array();
            for (var j = 0; j < Cnv.Links.length; j++) {
                if (Cnv.Links[j].from == i) {
                    NQ[NQ.length] = { intent: Cnv.Links[j].text, q: Cnv.Links[j].to }
                }
            }
            var nextq = "-1";
            if (n.type != "MessageEnd") {
                if (NQ.length != 0)
                    nextq = JSON.stringify(NQ);
            }
            n.nextq = nextq;
            NL[NL.length] = n;
            if (n.type == "SUB") {
                //n.options=FIRST ELEMENT OF THE SUB
                var ymin = 10000;
                var ysel = -1;
                for (var f = 0; f < Cnv.Nodes.length; f++) {
                    if (Cnv.Nodes[f].sub == n.q) {
                        if (Cnv.Nodes[f].y < ymin) {
                            ymin = Cnv.Nodes[f].y;
                            ysel = f;
                        }
                    }
                }
                n.options = ysel;
            }
        }
        tta.value = JSON.stringify(NL);//.replace(/"/g, '\\"');
    }
}
