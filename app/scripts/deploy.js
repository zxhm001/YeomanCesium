$(function(){
    var deployData = {
        person:[
            {
                name:'警察',
                model:'/data/model/police.glb',
                image:'/images/model/police.png',
                scale:20,
                params:['name','location']
            },
            {
                name:'医护人员',
                model:'/data/model/doctor.glb',
                image:'/images/model/doctor.png',
                scale:1,
                params:['name','location']
            },
            {
                name:'保安',
                model:'/data/model/guard.glb',
                image:'/images/model/guard.png',
                scale:1,
                params:['name','location']
            }
        ],
        car:[
            {
                name:'警车',
                model:'/data/model/police_car.glb',
                image:'/images/model/police_car.png',
                scale:15,
                params:['license','location','path']
            },
            {
                name:'消防车',
                model:'/data/model/fire_truck.glb',
                image:'/images/model/fire_truck.png',
                scale:1,
                params:['license','location','path']
            },
            {
                name:'救护车',
                model:'/data/model/ambulance.glb',
                image:'/images/model/ambulance.png',
                scale:1,
                params:['license','location','path']
            },
            {
                name:'警用摩托',
                model:'/data/model/motorcycle.glb',
                image:'/images/model/motorcycle.png',
                scale:1,
                params:['license','location','path']
            },
            {
                name:'反制车',
                model:'/data/model/armored_car.glb',
                image:'/images/model/armored_car.png',
                scale:1,
                params:['license','location','path','shed']
            }
        ],
        camera:[
            {
                name:'摄像头',
                model:'/data/model/camera.glb',
                image:'/images/model/camera.png',
                scale:0.1,
                params:['name','location','video','control','shed']
            },
            {
                name:'无人机',
                model:'/data/model/uav.glb',
                image:'/images/model/uav.png',
                scale:1,
                params:['name','location','video','path','control']
            }
        ],
        defence:[
            {
                name:'反制枪',
                model:'/data/model/gun.glb',
                image:'/images/model/gun.png',
                scale:1,
                params:['name','location','shed']
            },
            {
                name:'大型反制设备',
                model:'/data/model/smoking.glb',
                image:'/images/model/smoking.png',
                scale:1,
                params:['name','location','shed']
            }
        ],
        region:[
            {
                name:'危险区域',
                color: [255,0,0],
                image:'/images/model/danger.png',
                params:['name','location']
            },
            {
                name:'危险区域',
                color: [0,255,0],
                image:'/images/model/safe.png',
                params:['name','location']
            },
        ]
    };


    $('#modal_deploy').on('show.bs.modal', function (event) {
       
    });



    $('#deploy li').on('click',function(e){
        var type = $(e.target).data('type');
        $('#symbol_list').empty();
        var models = deployData[type];
        models.forEach(model => {
            var item = $(`<div class="symbol-item">
                <img alt="${model.name}" src="${model.image}">
                <p>${model.name}</p>
            </div>`);
            item.on('click',function(){
                onModelSelct(model);
            });
            $('#symbol_list').append(item);
        });
        $('.deploy-params').hide();
        $('.deploy-params .form-group').hide();
        $('#modal_deploy').modal();
    });

    /**
     * 选中绘制模型时
     * @param {*} model 
     */
    var onModelSelct = function(model){
        $('.deploy-params').show();
        $('.deploy-params .form-group').hide();
        model.params.forEach(param => {
            $('.deploy-params-' + param).show();
        });
        if (model.model) {
            //模型
        }
        else
        {
            //区域
        }
        console.log(model);
    };


}());