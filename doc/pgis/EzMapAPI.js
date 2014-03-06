/**
 *Description��EzServer Client js�����ĵ�����
 */
/**
 * ++++++++++++++++++++++++��һ���֣����������ò�������++++++++++++++++++++++++
 */
if (typeof EzServerClient == "undefined" || !EzServerClient) var EzServerClient = {};
if (typeof EzServerClient.GlobeParams == "undefined" || !EzServerClient.GlobeParams) EzServerClient.GlobeParams = {};

EzServerClient.GlobeParams.MapIpAddress = '172.21.12.51';
EzServerClient.GlobeParams.MapPort = 9080;
EzServerClient.GlobeParams.IsLocal = false;
EzServerClient.GlobeParams.IsDownMap = false;
EzServerClient.GlobeParams.LocalCacheDictery = '/cache/';
EzServerClient.GlobeParams.MyMapType = 'pgis';

if(GlobalConfig.apiAddress)
	EzServerClient.GlobeParams.MapIpAddress = GlobalConfig.apiAddress;
if(GlobalConfig.apiPort)
	EzServerClient.GlobeParams.MapPort = GlobalConfig.apiPort;
if(GlobalConfig.isLocal)
	EzServerClient.GlobeParams.IsLocal = GlobalConfig.isLocal;
if(GlobalConfig.isDownMap)
	EzServerClient.GlobeParams.IsDownMap = GlobalConfig.isDownMap;
if(GlobalConfig.productName)
	EzServerClient.GlobeParams.MyMapType = 	GlobalConfig.productName;


/**********************************************************************************/
/**************************����ΪEzServer Client���������ò������֣������ز����ڹ��캯�������ã�����Щ���ò�������ɾ�������ڹ���ʱ������**************************/
/**********************************************************************************/
/**
 *����˵��������ͼͼƬ�����ַ����ά����ڶ����У�[][0]ָͼƬ����������;[][1])ָͼƬ��������ַ;[][2]ָ������[][1]֮�µ�ͼƬ��������ַ��[][2]��ʡ�ԣ�
 *�������ͣ�{[][(2|3)][]String} String���͵�n*(2|3)*n����ά����
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */
//EzServerClient.GlobeParams.MapSrcURL = [["map-jw-china",["http://172.18.69.154:8080/EzServer66/Maps/map-jw-china"]]
//                                    	];
EzServerClient.GlobeParams.MapSrcURL = [
	["ʸ����ͼ", ["http://10.173.2.20/PGIS_S_TileMapServer/Maps/V"]],
	["Ӱ���ͼ", ["http://10.173.2.20/PGIS_S_TileMapServer/Maps/R"]],
	["ʸ��Ӱ���ͼ", ["http://10.173.2.20/PGIS_S_TileMapServer/Maps/RV"]]
];

//���ӵ�ͼ��������:
//EzServerClient.GlobeParams.MapSrcURL = [["ʸ�����ӵ�ͼ",["http://192.168.10.14:701/EzServer_DF_SLYX"],["http://192.168.10.14:701/EzServer_DF_YX"]]];
//��Ⱥ��ͼ��������(�ϱ߱����е�[][1]��[][2]�������ö��ͼƬ��Դ��ַ������ǰ��ͼ����Ƭ���Զ����Դ���Լ���ͼƬ�����������ͼӿ���ʾ�ٶ�):
//EzServerClient.GlobeParams.MapSrcURL= [["ʸ��Ӱ��",["http://192.168.10.3/EzServer","http://192.168.10.4/EzServer"]]];


/**
 *����˵�������ð�Ȩ��Ϣ
 *�������ͣ�{String}
 *ȡֵ��Χ��������
 *Ĭ��ֵ��""
 *����������������ʾ
 */
EzServerClient.GlobeParams.Copyright = "&copy; PGis";

/**
 *����˵����������ʾ��̬ͼƬ��Դ��Ȩ��Ϣ
 *�������ͣ�{Array}
 *ȡֵ��Χ��������
 *Ĭ��ֵ��[]����ʱ��ʾ����̬����ʾ��Ȩ��Ϣ��
 *����������������ʾ
 */
EzServerClient.GlobeParams.DynamicCopyright = []; //��ʾ����̬����ʾ��Ȩ��Ϣ
/**
EzServerClient.GlobeParams.DynamicCopyright = [
	//���¶����壺ͼƬ��ԴΪhttp://192.168.10.241:9080/EzServerV634/Maps/map-jw-china ������5��8����ʵ�ʵļ��𣩣�����������116.32458,39.89782,116.3927,39.94738��Χ֮�ڵ�ͼƬ�����½ǰ�Ȩ��ʾΪ@2009PGIS������
	{
		label:"<font size=2 >@2009PGIS������</font>", //��Ȩ��Ϣ����
		source:"http://192.168.10.241:9080/EzServerV634/Maps/map-jw-china", //ͼƬ��Դ
		minzoom:5,//��С����ʵ�ʵļ��𣬼�EzServerClient.GlobeParams.ZoomOffset==0ʱ�ļ���
		maxzoom:8,//��󼶱�
		region : new MBR(116.32458,39.89782,116.3927,39.94738)//��ʾ��Ȩ��Ϣ������Χ
	},
	//���¶����壺ͼƬ��ԴΪhttp://192.168.10.115:10000/EzServerV634/Maps/map-jw-bj ������2��3����ʵ�ʵļ��𣩣�����������116.38269,39.89685,116.4447,39.96325��Χ֮�ڵ�ͼƬ�����½ǰ�Ȩ��ʾΪ@2009PGIS������
	{
		label:"<font size=2 >@2009PGIS������</font>", 
		source:"http://192.168.10.115:10000/EzServerV634/Maps/map-jw-bj",
		minzoom:2, maxzoom:4, region:new MBR(116.38269,39.89685,116.4447,39.96325) 
	}
];
*/

/**
 *����˵�������ð汾��Ϣ
 *�������ͣ�{Float}
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.Version = 0.3;


/**
 *����˵�������õ�ͼ��ʼ������λ��
 *�������ͣ�{[2]Float} ����Ϊ2��Float��������
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */

EzServerClient.GlobeParams.CenterPoint = [108.72265, 34.24023];


/**
 *����˵��������ȫͼ��ʾʱ��ͼ��ʾ��Χ
 *�������ͣ�{[4]Float} ����Ϊ4��Float��������
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */

EzServerClient.GlobeParams.MapFullExtent = [107.4414,33.75,110.0039,34.73046];

/**
 *����˵�������õ�ͼ��ʼ��ʾ����
 *�������ͣ�{Float}
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapInitLevel = 12;

/**
 *����˵�������õ�ͼ��ʾ����󼶱�
 *�������ͣ�{Float}
 *ȡֵ��Χ��[0,22]
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapMaxLevel = 20;

/**
 *����˵�������õ�ͼ�����ƫ��������Ϊ����������ǰ�����ʵ�ʼ���=��ǰ����-EzServerClient.GlobeParams.ZoomOffset��
 *�������ͣ�{Float}
 *ȡֵ��Χ��������
 *Ĭ��ֵ��0
 *����������������ʾ
 */
EzServerClient.GlobeParams.ZoomOffset = 0;

/**
 *����˵����������Դ��ͼͼƬ��С������ͼƬ��Դ�������ṩͼƬ�Ĵ�С������
 *�������ͣ�{Int}
 *ȡֵ��Χ��128|256
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapUnitPixels = 256;

/**
 *����˵�������õ�ͼ����ϵ���ͣ���γ������ϵΪ1���ط�����ʱΪEzServerClient.GlobeParams.MapConvertScale���趨��ֵ
 *�������ͣ�{Int}
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapCoordinateType = 1;
//EzServerClient.GlobeParams.MapCoordinateType = 114699;

/**
 *����˵�������õط�����ϵ���ű�����������ͼʱ��������ֵ�趨��ֵ��
 *�������ͣ�{Int}
 *ȡֵ��Χ��������
 *Ĭ��ֵ��114699
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapConvertScale = 114699;

/**
 *����˵�������õط�����ϵX��ƫ��������ʱ��������ͼʱ��������ֵ�趨��ֵ��
 *�������ͣ�{Int}
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapConvertOffsetX = 0;
/**
 *����˵�������õط�����ϵY��ƫ��������ʱ��������ͼʱ��������ֵ�趨��ֵ��
 *�������ͣ�{Int}
 *ȡֵ��Χ��������
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapConvertOffsetY = 0;


/**
 *����˵�������õ�ͼͼƬ�Ƿ����
 *�������ͣ�{Boolean}
 *ȡֵ��Χ��true|false
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.IsOverlay = true;

/**
 *����˵�������������ͼͼƬ��Դ�Ƿ�ͨ������
 *�������ͣ�{Boolean}
 *ȡֵ��Χ��true|false
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.MapProx = false;

/**
 *����˵�������õ�ͼ�����߼����ǽ���������ģ��Լ����õ���ʲô�汾����ͼ��ͼ
 *�������ͣ�{Int}
 *ȡֵ��Χ��{0,1,2,3}
 *Ĭ��ֵ��0
 *����������������ʾ
 */
EzServerClient.GlobeParams.ZoomLevelSequence = 2;
//EzServerClient.GlobeParams.ZoomLevelSequence = 0;// �����ߵȼ�������������EzServer����������ͼ�ȼ�����
//EzServerClient.GlobeParams.ZoomLevelSequence = 1;// �����ߵȼ��������½���EzServer����������ͼ�ȼ�����
//EzServerClient.GlobeParams.ZoomLevelSequence = 2;// �����ߵȼ��������½���EzServer����������ͼ�ȼ�����
//EzServerClient.GlobeParams.ZoomLevelSequence = 3;// �����ߵȼ�������������EzServer����������ͼ�ȼ�����

/**
 *����˵����������Ƭ��ͼ��ʼê�㣬��0��0�е�ͼ�����½ǵ�ͼ���꣬��Ƭ���кŷ���Ϊ�Դ�ê���������ҵ���
 *�������ͣ�{[2]Float}
 *ȡֵ��Χ��{������}
 *Ĭ��ֵ��[0, 0]
 *����������������ʾ
 */
EzServerClient.GlobeParams.TileAnchorPoint = [0, 0];


/**
 *����˵���������Ҫ���ÿռ�ʸ�����ݷ�������Ҫ��������Ĭ��EzMapService�����õ�ַ���й�EzMapService����Ľ��������EzMapService���йؽ��ܣ���ѡ���ã�
 *�������ͣ�{String}
 *ȡֵ��Χ����
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.EzMapServiceURL = "";

/**
 *����˵���������Ҫ���õ������������Ҫ��������Ĭ��EzGeographicProcessingService���õ�ַ���й�EzGeographicProcessingService����Ľ��������EzGeographicProcessingService���йؽ��ܣ���ѡ���ã�
 *�������ͣ�{String}
 *ȡֵ��Χ����
 *Ĭ��ֵ����
 *����������������ʾ
 */
//��������˵��������EzGeographicProcessingService��ͨ������������ؽű�
//EzServerClient.GlobeParams.EzGeoPSURL = "http://192.168.10.183:10000/EzGeoPS";	
//document.writeln("<script type='text/javascript' charset='GB2312' src='" + EzServerClient.GlobeParams.EzGeoPSURL + "/ezgeops_js/EzGeoPS.js'></script>");

/**
 *����˵���������ȵ���ʽ
 *�������ͣ�{Object}
 *ȡֵ��Χ����
 *Ĭ��ֵ����
 *����������������ʾ
 */
EzServerClient.GlobeParams.HotspotStyle = {
	//�����ȵ�߿���ɫ
	borderColor: "red",
	//�����ȵ�߿���
	borderWeight: "1.2pt",
	//�����ȵ������ɫ
	fillColor: "blue",
	//�����ȵ����͸����
	opacity: "19660f"
};

EzServerClient.GlobeParams.EzServerClientURL="";
/**********************************************************************************/
/**************************************�������ý���*************************************/
/**********************************************************************************/


/**
 * ++++++++++++++++++++++++�ڶ����֣����ű�����++++++++++++++++++++++++
 */
/**
 * Description��EzServer Client���ű�
 */
 

/**
 * Constant: �汾��
 */
EzServerClient.VERSION_NUMBER = "V6.6.6.201108121100a";