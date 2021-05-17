$(function () {
    var data = {
        'Result': 2000,
        'Message': 'OK',
        'Users': [
            { 'Uid': '76799', 'Name': '10号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true },
            { 'Uid': '76800', 'Name': '11号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76801', 'Name': '12号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76802', 'Name': '13号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76803', 'Name': '14号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true },
            { 'Uid': '76804', 'Name': '15号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76805', 'Name': '16号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76806', 'Name': '17号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76807', 'Name': '18号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76808', 'Name': '19号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76790', 'Name': '1号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76809', 'Name': '20号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76810', 'Name': '21号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76811', 'Name': '22号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76812', 'Name': '23号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true },
            { 'Uid': '76813', 'Name': '24号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76814', 'Name': '25号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76815', 'Name': '26号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76816', 'Name': '27号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76817', 'Name': '28号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76818', 'Name': '29号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76791', 'Name': '2号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76819', 'Name': '30号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76820', 'Name': '31号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76821', 'Name': '32号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
            { 'Uid': '76822', 'Name': '33号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76823', 'Name': '34号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76824', 'Name': '35号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85158', 'Name': '36号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85161', 'Name': '37号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85162', 'Name': '38号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85163', 'Name': '39号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '76792', 'Name': '3号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85164', 'Name': '40号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85165', 'Name': '41号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85166', 'Name': '42号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			{ 'Uid': '85167', 'Name': '43号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true },
             { 'Uid': '85168', 'Name': '44号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85169', 'Name': '45号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85170', 'Name': '46号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85171', 'Name': '47号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85229', 'Name': '48号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85172', 'Name': '49号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '76793', 'Name': '4号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85173', 'Name': '50号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85174', 'Name': '51号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85230', 'Name': '52号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85175', 'Name': '53号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85176', 'Name': '54号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85177', 'Name': '55号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85179', 'Name': '56号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85180', 'Name': '57号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85181', 'Name': '58号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85182', 'Name': '59号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '76794', 'Name': '5号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85183', 'Name': '60号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85184', 'Name': '61号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85195', 'Name': '62号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85196', 'Name': '63号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85197', 'Name': '64号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85198', 'Name': '65号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '76795', 'Name': '6号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '76796', 'Name': '7号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '76797', 'Name': '8号机', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '76798', 'Name': '9号机', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }, 
			 { 'Uid': '85526', 'Name': '管理员', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [{ 'ManagerId': '7964', 'Name': 'shba01', 'Mdn': '', 'Uid': '85526' }], 'LocPermission': true }, 
			 { 'Uid': '85847', 'Name': '花博会', 'Mdn': null, 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': false, 'Alias': [{ 'ManagerId': '8454', 'Name': 'hbhddy', 'Mdn': '', 'Uid': '85847' }], 'LocPermission': true },
             { 'Uid': '76833', 'Name': '调度员', 'Mdn': '', 'isChat': '1', 'isLocation': '1', 'isRecord': '0', 'isMedia': '0', 'liveVideo': '0', 'Monitor': true, 'Alias': [], 'LocPermission': true }]
    }

    function test(){
        function uploadUnipttDevice(){
            data['Users'].forEach(user => {
                var name = user['Name']
                var license = user['Uid']
                if (name != '管理员' && name != '花博会' && name != '调度员') {
                    var d_data = {
                        name:name,
                        license:license,
                        type:'对讲机',
                    };
                    $.ajax({
                        type: 'POST',
                        url: API_ROOT + '/api/device',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(d_data),
                        dataType: 'json',
                        success: function (response) {
                            if (response.succeeded) {
                                console.log(name,'添加成功！');
                            }
                            else
                            {
                                console.error(name,'添加失败！');
                                console.error(response.errors);
                            }
                            console.log(response);
                        },
                        error: function (err) {
                            console.error(err);
                        }
                    });
                }
            });
        }
        return{
            uploadUnipttDevice:uploadUnipttDevice
        }
    }

    window.Test = test();
}())