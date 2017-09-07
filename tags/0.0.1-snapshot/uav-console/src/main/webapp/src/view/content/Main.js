﻿/**
 * 图片轮播main
 */
Ext.define('Rich.view.content.Main', {
	requires:[
		'Rich.widget.Message',
		'Ext.grid.Panel',
		'Ext.form.Panel',
		'Ext.form.field.Date',
		'Ext.form.FieldContainer',
        'Ext.form.field.Hidden',
        'Ext.form.field.Trigger',
        'Ext.form.field.ComboBox',
        'Ext.form.CheckboxGroup',
        'Ext.grid.column.Action',
        'Ext.layout.component.FieldSet',
        'Rich.model.Picture',
        'Rich.view.content.PictureForm',
        'Ext.form.field.Checkbox',
        'Ext.toolbar.Paging',
        'Rich.widget.CrudWindow',
        'Rich.component.DicComboBox'
    ],
    extend: 'Ext.panel.Panel',
    alias:'widget.contenttmain',
	initComponent:function(){
		var me = this;	
		//var detail = Rich.RightManager.hasRight(Rich.V.journey_querySchedulePriceDetail);//详情权限
		//var al = Rich.RightManager.hasRight(Rich.V.journey_queryMegagameJourney);//分页权限
		var action = [{
            icon: 'resources/images/icons/6.png',
            iconCls:'actioncolumn-margin',
            altText:'查看详情',
            tooltip: '查看详情',
            //disabled:!detail,//picture
            handler: function(gridview, rowIndex, colIndex) {
                var rec = gridview.getStore().getAt(rowIndex);
                this.up('gridpanel').lookDetail(rec);
            }
        }]
		var store = Ext.create('Ext.data.Store', {
			model:'Rich.model.Picture',
	        pageSize: 50,
	        autoLoad:true,
	        proxy: {
		        type: 'ajax',
		        getMethod:function(){return "get"},
		        url: Rich.Url.tupiaPath,
		        reader: {
		            type: 'json',
		            root: 'data.pageData',
		            totalProperty: 'data.totalRows',
		            idProperty: 'id'
		        }
		    }
		});
		
		var itms = [{
	    	xtype:'form',
	    	style:{padding:"10px"},
	    	docked:'top',
	    	defaults:{ 
	    		xtype:'textfield',
	    		labelWidth:70,
	    		style:{float:"left",margin:"5px 0  5px 10px"}
	    	},
	    	layout:'auto',
		    items: [{
		        fieldLabel: '序号',
		        name: 'id'
		    },{
		        fieldLabel: '标题描述',
		        name: 'titleDesc'
		    },{
		    	fieldLabel:'排序',
		    	name:'sortOrder'
		    },{
	            xtype      : 'fieldcontainer',
	            fieldLabel : '创建时间',
	            width:300,
	            labelWidth:60, 
	            defaults: {
	                hideLabel: true
	            },
	            layout: 'hbox',
	            items: [{
						xtype: 'datefield',
						flex:1,
					    anchor: '100%',
					    name: 'createTime_begin',
					    format:'Y-m-d'
					},{xtype:'label',text:'-',style:{'line-height': '25px;'}},{
						xtype: 'datefield',
						flex:1,
					    anchor: '100%',
					    name: 'createTime_end',
					    format:'Y-m-d'
					}]
	        },{
		    	xtype:'button',
		    	text:'重置',
		    	cls:'r-btn-font-normal',
		    	style:{float:"right",margin:"5px 10px 5px 0"},
		    	rightId:Rich.V.journey_queryMegagameJourney,
		    	handler:function(btn){
		    		this.up('form').getForm().reset();
		    	}
		    },{
		    	xtype:'button',
		    	text:'搜索',
		    	cls:'r-btn-font-normal',
		    	style:{float:"right",margin:"5px 10px 5px 10px"},
		    	rightId:Rich.V.journey_queryMegagameJourney,
		    	handler:function(btn){
		    		var vs = this.up('form').getForm().getValues();
		    		var sto = this.up('gridpanel').getStore();
		    		sto.getProxy().extraParams = vs;
		    		sto.loadPage(1);
		    	}
		    }]
		}];
		itms.unshift({
				xtype:'toolbar',
				ui:'footer',
				items:[{
				xtype:'button',
				text:'新建轮播图',
				handler:function(btn){
					Ext.create('Rich.widget.CrudWindow',{
						title:this.text,
						width:0.4,
						crudForm:{
							xtype:'pictureform',
							tid:1,
							buttons:['c']
						}
					}).showFor(btn.returnFn,btn);
				},
				returnFn:function(){
					this.up('contenttmain').lookupI('list').getStore().reload();
				}
			}]
		});
		Ext.apply(me,{
			layout:'fit',
			items:[{
				xtype:'gridpanel',
				itemId:'list',
				loadMask: true,
		    	forceFit:true,
		    	store: store,
			    bbar: Ext.create('Ext.PagingToolbar', {
		            store: store,
		            displayInfo: true,
		            displayMsg: '显示 {0} - {1} of {2}',
		            emptyMsg: "没有数据",
		            items:['-']
		        }),
			   	columnLines: true,
			  	columns: {
				   	defaults:{
				        sortable:false,
				        draggable:false,
				        //enableColumnHide:false,
				        menuDisabled:true
				   	},
				   	items:[
				   		{ text: '序号', dataIndex: 'id',flex: 1 },
				   		{ text: '标题描述', dataIndex: 'titleDesc',flex: 1 },
				        { text: '图片链接', dataIndex: 'imgLink',flex: 1 },
				        { text: '排序', dataIndex: 'sortOrder',flex: 1 },
				       	{ text: '是否隐藏', dataIndex: 'orginator',flex: 1,renderer:function(v){
				        	if(v == '1'){
				        		return '否';
				        	}else{
				        		return '是';
				        	}
				        }},
				        { text: '是否删除', dataIndex: 'createTime',flex:1,renderer:function(v){
				        	if(v == '1'){
				        		return '否';
				        	}else{
				        		return '是';
				        	}
				        }},
				        { text: '创建时间', dataIndex: 'createTime',flex: 1},
				        { text: '创建人', dataIndex: 'creator',flex: 1},
				        {
				        	text:'操作',
				            xtype:'actioncolumn',
				            width:70,
				            items: action
				        }
				]},
				lookDetail:function(record){
					Ext.create('Rich.widget.CrudWindow',{
						title:'图片轮播详情',
						width:0.6,
						height:0.8,
						crudForm:{
							xtype:'pictureform',
							buttons:['u']
						}
					}).showByParams({id:record.get('id')},this.upStateBack,this);
			    },
			    listeners:{
			    	"itemdblclick0":function(gd,record, item, index, e, eOpts){
			    		this.lookDetail(record);
			    	}
			    },
			    dockedItems:itms
			}]
		});
		this.callParent(arguments);
	}
});