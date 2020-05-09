/*                var PI = 3.14159265358979324;
                function transformGCJ2WGS(gcjLat, gcjLon) {
                    let d = delta(gcjLat, gcjLon)
                    return {
                        'lat': gcjLat - d.lat,
                        'lon': gcjLon - d.lon
                    }
                }
                function delta(lat, lon) {
                    let a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
                    let ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
                    let dLat = transformLat(lon - 105.0, lat - 35.0)
                    let dLon = transformLon(lon - 105.0, lat - 35.0)
                    let radLat = lat / 180.0 * PI
                    let magic = Math.sin(radLat)
                    magic = 1 - ee * magic * magic
                    let sqrtMagic = Math.sqrt(magic)
                    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
                    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
                    return {
                        'lat': dLat,
                        'lon': dLon
                    }
                }
                function transformLat(x, y) {
                    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
                    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
                    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
                    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
                    return ret
                }
                function transformLon(x, y) {
                    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
                    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
                    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
                    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
                    return ret
                }*/

       /*         var GPS = {

                    PI: 3.14159265358979324,
                    x_pi: 3.14159265358979324 * 3000.0 / 180.0,
                    delta: function (lat, lon)
                    {
                        // Krasovsky 1940
                        //
                        // a = 6378245.0, 1/f = 298.3
                        // b = a * (1 - f)
                        // ee = (a^2 - b^2) / a^2;
                        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
                        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
                        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
                        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
                        var radLat = lat / 180.0 * this.PI;
                        var magic = Math.sin(radLat);
                        magic = 1 - ee * magic * magic;
                        var sqrtMagic = Math.sqrt(magic);
                        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
                        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
                        return { 'lat': dLat, 'lon': dLon };
                    },

                    //WGS-84 to GCJ-02
                    gcj_encrypt: function (wgsLat, wgsLon)
                    {
                        if (this.outOfChina(wgsLat, wgsLon))
                            return { 'lat': wgsLat, 'lon': wgsLon };

                        var d = this.delta(wgsLat, wgsLon);
                        return { 'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon };
                    },
                    //GCJ-02 to WGS-84
                    gcj_decrypt: function (gcjLat, gcjLon)
                    {
                        if (this.outOfChina(gcjLat, gcjLon))
                            return { 'lat': gcjLat, 'lon': gcjLon };

                        var d = this.delta(gcjLat, gcjLon);
                        return { 'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon };
                    },
                    //GCJ-02 to WGS-84 exactly
                    gcj_decrypt_exact: function (gcjLat, gcjLon)
                    {
                        var initDelta = 0.01;
                        var threshold = 0.000000001;
                        var dLat = initDelta, dLon = initDelta;
                        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
                        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
                        var wgsLat, wgsLon, i = 0;
                        while (1)
                        {
                            wgsLat = (mLat + pLat) / 2;
                            wgsLon = (mLon + pLon) / 2;
                            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
                            dLat = tmp.lat - gcjLat;
                            dLon = tmp.lon - gcjLon;
                            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                                break;

                            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
                            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

                            if (++i > 10000) break;
                        }
                        //console.log(i);
                        return { 'lat': wgsLat, 'lon': wgsLon };
                    },
                    //GCJ-02 to BD-09
                    bd_encrypt: function (gcjLat, gcjLon)
                    {
                        var x = gcjLon, y = gcjLat;
                        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
                        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
                        bdLon = z * Math.cos(theta) + 0.0065;
                        bdLat = z * Math.sin(theta) + 0.006;
                        return { 'lat': bdLat, 'lon': bdLon };
                    },
                    //BD-09 to GCJ-02
                    bd_decrypt: function (bdLat, bdLon)
                    {
                        var x = bdLon - 0.0065, y = bdLat - 0.006;
                        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
                        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
                        var gcjLon = z * Math.cos(theta);
                        var gcjLat = z * Math.sin(theta);
                        return { 'lat': gcjLat, 'lon': gcjLon };
                    },
                    //WGS-84 to Web mercator
                    //mercatorLat -> y mercatorLon -> x
                    mercator_encrypt: function (wgsLat, wgsLon)
                    {
                        var x = wgsLon * 20037508.34 / 180.;
                        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
                        y = y * 20037508.34 / 180.;
                        return { 'lat': y, 'lon': x };
                        /!*
                        if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
                            return null;
                        var x = 6378137.0 * wgsLon * 0.017453292519943295;
                        var a = wgsLat * 0.017453292519943295;
                        var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
                        return {'lat' : y, 'lon' : x};
                        //!*!/
                    },
                    // Web mercator to WGS-84
                    // mercatorLat -> y mercatorLon -> x
                    mercator_decrypt: function (mercatorLat, mercatorLon)
                    {
                        var x = mercatorLon / 20037508.34 * 180.;
                        var y = mercatorLat / 20037508.34 * 180.;
                        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
                        return { 'lat': y, 'lon': x };
                        /!*
                        if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
                            return null;
                        if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
                            return null;
                        var a = mercatorLon / 6378137.0 * 57.295779513082323;
                        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
                        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
                        return {'lat' : y, 'lon' : x};
                        //!*!/
                    },
                    // two point's distance
                    distance: function (latA, lonA, latB, lonB)
                    {
                        var earthR = 6371000.;
                        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
                        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
                        var s = x + y;
                        if (s > 1) s = 1;
                        if (s < -1) s = -1;
                        var alpha = Math.acos(s);
                        var distance = alpha * earthR;
                        return distance;
                    },
                    outOfChina: function (lat, lon)
                    {
                        if (lon < 72.004 || lon > 137.8347)
                            return true;
                        if (lat < 0.8293 || lat > 55.8271)
                            return true;
                        return false;
                    },
                    transformLat: function (x, y)
                    {
                        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
                        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
                        return ret;
                    },
                    transformLon: function (x, y)
                    {
                        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
                        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
                        return ret;
                    }
                };*/
                /**
                 * Created by Wandergis on 2015/7/8.
                 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
                 */
//UMD魔法代码
// if the module has no dependencies, the above pattern can be simplified to
/*

                    //定义一些常量
                    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
                    var PI = 3.1415926535897932384626;
                    var a = 6378245.0;
                    var ee = 0.00669342162296594323;
                    var MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
                    var LLBAND = [75, 60, 45, 30, 15, 0];
                    var MC2LL = [
                        [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2],
                        [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86],
                        [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37],
                        [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06],
                        [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4],
                        [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]
                    ];
                    var LL2MC = [
                        [-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5],
                        [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5],
                        [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5],
                        [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5],
                        [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5],
                        [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]
                    ];
                    /!**
                     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
                     * 即 百度 转 谷歌、高德
                     * @param bd_lon
                     * @param bd_lat
                     * @returns {*[]}
                     *!/
                    var bd09togcj02 = function bd09togcj02(bd_lon, bd_lat) {
                        var bd_lon = +bd_lon;
                        var bd_lat = +bd_lat;
                        var x = bd_lon - 0.0065;
                        var y = bd_lat - 0.006;
                        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
                        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
                        var gg_lng = z * Math.cos(theta);
                        var gg_lat = z * Math.sin(theta);
                        return [gg_lng, gg_lat]
                    };

                    /!**
                     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
                     * 即谷歌、高德 转 百度
                     * @param lng
                     * @param lat
                     * @returns {*[]}
                     *!/
                    var gcj02tobd09 = function gcj02tobd09(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
                        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
                        var bd_lng = z * Math.cos(theta) + 0.0065;
                        var bd_lat = z * Math.sin(theta) + 0.006;
                        return [bd_lng, bd_lat]
                    };

                    /!**
                     * WGS84转GCj02
                     * @param lng
                     * @param lat
                     * @returns {*[]}
                     *!/
                    var wgs84togcj02 = function wgs84togcj02(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        if (out_of_china(lng, lat)) {
                            return [lng, lat]
                        } else {
                            var dlat = transformlat(lng - 105.0, lat - 35.0);
                            var dlng = transformlng(lng - 105.0, lat - 35.0);
                            var radlat = lat / 180.0 * PI;
                            var magic = Math.sin(radlat);
                            magic = 1 - ee * magic * magic;
                            var sqrtmagic = Math.sqrt(magic);
                            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                            var mglat = lat + dlat;
                            var mglng = lng + dlng;
                            return [mglng, mglat]
                        }
                    };
                    /!**
                     * GCJ02 转换为 WGS84
                     * @param lng
                     * @param lat
                     * @returns {*[]}
                     *!/
                    var gcj02towgs84 = function gcj02towgs84(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        if (out_of_china(lng, lat)) {
                            return [lng, lat]
                        } else {
                            var dlat = transformlat(lng - 105.0, lat - 35.0);
                            var dlng = transformlng(lng - 105.0, lat - 35.0);
                            var radlat = lat / 180.0 * PI;
                            var magic = Math.sin(radlat);
                            magic = 1 - ee * magic * magic;
                            var sqrtmagic = Math.sqrt(magic);
                            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                            var mglat = lat + dlat;
                            var mglng = lng + dlng;
                            return [lng * 2 - mglng, lat * 2 - mglat]
                        }
                    };


                    var transformlat = function transformlat(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
                        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
                        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
                        return ret
                    };

                    var transformlng = function transformlng(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
                        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
                        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
                        return ret
                    };

                    /!**
                     * 判断是否在国内，不在国内则不做偏移
                     * @param lng
                     * @param lat
                     * @returns {boolean}
                     *!/
                    var out_of_china = function out_of_china(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        // 纬度3.86~53.55,经度73.66~135.05
                        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
                    };
                    /!**
                     * 百度墨卡托转百度经纬度
                     * @param lng
                     * @param lat
                     * @returns {*[]}
                     *!/
                    var BD_MKT2WGS = function BD_MKT2WGS(lng, lat) {
                        var cF = null;
                        lng = Math.abs(lng);
                        lat = Math.abs(lat);
                        for (var cE = 0; cE < MCBAND.length; cE++) {
                            if (lat >= MCBAND[cE]) {
                                cF = MC2LL[cE];
                                break;
                            }
                        }
                        lng = cF[0] + cF[1] * Math.abs(lng);
                        var cC = Math.abs(lat) / cF[9];
                        lat = cF[2] + cF[3] * cC + cF[4] * cC * cC + cF[5] * cC * cC * cC + cF[6] * cC * cC * cC * cC + cF[7] * cC * cC * cC * cC * cC + cF[8] * cC * cC * cC * cC * cC * cC;
                        lng *= (lng < 0 ? -1 : 1);
                        lat *= (lat < 0 ? -1 : 1);
                        return [lng, lat];
                    }
                    var _getLoop = function _getLoop(lng, min, max) {
                        while (lng > max) {
                            lng -= max - min;
                        }
                        while (lng < min) {
                            lng += max - min;
                        }
                        return lng;
                    };

                    var _getRange = function _getRange(lat, min, max) {
                        if (min != null) {
                            lat = Math.max(lat, min);
                        }
                        if (max != null) {
                            lat = Math.min(lat, max);
                        }
                        return lat;
                    };
                    /!**
                     * 百度经纬度转百度墨卡托
                     * @param lng
                     * @param lat
                     * @returns {*[]}
                     *!/
                    var BD_WGS2MKT = function BD_WGS2MKT(lng, lat) {
                        var cF = null;
                        lng = _getLoop(lng, -180, 180);
                        lat = _getRange(lat, -74, 74);
                        for (var i = 0; i < LLBAND.length; i++) {
                            if (lat >= LLBAND[i]) {
                                cF = LL2MC[i];
                                break;
                            }
                        }
                        if (cF != null) {
                            for (var i = LLBAND.length - 1; i >= 0; i--) {
                                if (lat <= -LLBAND[i]) {
                                    cF = LL2MC[i];
                                    break;
                                }
                            }
                        }
                        lng = cF[0] + cF[1] * Math.abs(lng);
                        var cC = Math.abs(lat) / cF[9];
                        lat = cF[2] + cF[3] * cC + cF[4] * cC * cC + cF[5] * cC * cC * cC + cF[6] * cC * cC * cC * cC + cF[7] * cC * cC * cC * cC * cC + cF[8] * cC * cC * cC * cC * cC * cC;
                        lng *= (lng < 0 ? -1 : 1);
                        lat *= (lat < 0 ? -1 : 1);
                        return [lng, lat];
                    }
                    //经纬度转墨卡托
                    function latLng2WebMercator(lng, lat) {
                        var earthRad = 6378137.0;
                        var x = lng * Math.PI / 180 * earthRad;
                        var a = lat * Math.PI / 180;
                        var y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
                        return [x, y]; //[12727039.383734727, 3579066.6894065146]
                    }
                    //墨卡托转经纬度
                    function webMercator2LngLat(x, y) { //[12727039.383734727, 3579066.6894065146]
                        var lng = x / 20037508.34 * 180;
                        var lat = y / 20037508.34 * 180;
                        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                        return [lng, lat]; //[114.32894001591471, 30.58574800385281]
                    }
*/


   /**
                 *  判断经纬度是否超出中国境内
                 */
                function isLocationOutOfChina(latitude, longitude) {
                    if (longitude < 72.004 || longitude > 137.8347 || latitude < 0.8293 || latitude > 55.8271)
                        return true;
                    return false;
                }


                /**
                 *  将WGS-84(国际标准)转为GCJ-02(火星坐标):
                 */
                function transformFromWGSToGCJ(latitude, longitude) {
                    var lat = "";
                    var lon = "";
                    var ee = 0.00669342162296594323;
                    var a = 6378245.0;
                    var pi = 3.14159265358979324;

                    if (isLocationOutOfChina(latitude, longitude)) {
                        lat = latitude;
                        lon = longitude;
                    }
                    else {
                        var adjustLat = transformLatWithXY(longitude - 105.0, latitude - 35.0);
                        var adjustLon = transformLonWithXY(longitude - 105.0, latitude - 35.0);
                        var radLat = latitude / 180.0 * pi;
                        var magic = Math.sin(radLat);
                        magic = 1 - ee * magic * magic;
                        var sqrtMagic = Math.sqrt(magic);
                        adjustLat = (adjustLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
                        adjustLon = (adjustLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
                        latitude = latitude + adjustLat;
                        longitude = longitude + adjustLon;
                    }
                    return { latitude: latitude, longitude: longitude };

                }

                /**
                 *  将GCJ-02(火星坐标)转为百度坐标:
                 */
                function transformFromGCJToBaidu(latitude, longitude) {
                    var pi = 3.14159265358979324 * 3000.0 / 180.0;

                    var z = Math.sqrt(longitude * longitude + latitude * latitude) + 0.00002 * Math.sin(latitude * pi);
                    var theta = Math.atan2(latitude, longitude) + 0.000003 * Math.cos(longitude * pi);
                    var a_latitude = (z * Math.sin(theta) + 0.006);
                    var a_longitude = (z * Math.cos(theta) + 0.0065);

                    return { latitude: a_latitude, longitude: a_longitude };
                }

                /**
                 *  将百度坐标转为GCJ-02(火星坐标):
                 */
                function transformFromBaiduToGCJ(latitude, longitude) {
                    var xPi = 3.14159265358979323846264338327950288 * 3000.0 / 180.0;

                    var x = longitude - 0.0065;
                    var y = latitude - 0.006;
                    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
                    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
                    var a_latitude = z * Math.sin(theta);
                    var a_longitude = z * Math.cos(theta);

                    return { latitude: a_latitude, longitude: a_longitude };
                }

                /**
                 *  将GCJ-02(火星坐标)转为WGS-84:
                 */
                function transformFromGCJToWGS(latitude, longitude) {
                    var threshold = 0.00001;

                    // The boundary
                    var minLat = latitude - 0.5;
                    var maxLat = latitude + 0.5;
                    var minLng = longitude - 0.5;
                    var maxLng = longitude + 0.5;

                    var delta = 1;
                    var maxIteration = 30;

                    while (true) {
                        var leftBottom = transformFromWGSToGCJ(minLat, minLng);
                        var rightBottom = transformFromWGSToGCJ(minLat, maxLng);
                        var leftUp = transformFromWGSToGCJ(maxLat, minLng);
                        var midPoint = transformFromWGSToGCJ((minLat + maxLat) / 2, (minLng + maxLng) / 2);
                        delta = Math.abs(midPoint.latitude - latitude) + Math.abs(midPoint.longitude - longitude);

                        if (maxIteration-- <= 0 || delta <= threshold) {
                            return { latitude: (minLat + maxLat) / 2, longitude: (minLng + maxLng) / 2 };
                        }

                        if (isContains({ latitude: latitude, longitude: longitude }, leftBottom, midPoint)) {
                            maxLat = (minLat + maxLat) / 2;
                            maxLng = (minLng + maxLng) / 2;
                        }
                        else if (isContains({ latitude: latitude, longitude: longitude }, rightBottom, midPoint)) {
                            maxLat = (minLat + maxLat) / 2;
                            minLng = (minLng + maxLng) / 2;
                        }
                        else if (isContains({ latitude: latitude, longitude: longitude }, leftUp, midPoint)) {
                            minLat = (minLat + maxLat) / 2;
                            maxLng = (minLng + maxLng) / 2;
                        }
                        else {
                            minLat = (minLat + maxLat) / 2;
                            minLng = (minLng + maxLng) / 2;
                        }
                    }

                }

                function isContains(point, p1, p2) {
                    return (point.latitude >= Math.min(p1.latitude, p2.latitude) && point.latitude <= Math.max(p1.latitude, p2.latitude)) && (point.longitude >= Math.min(p1.longitude, p2.longitude) && point.longitude <= Math.max(p1.longitude, p2.longitude));
                }

                function transformLatWithXY(x, y) {
                    var pi = 3.14159265358979324;
                    var lat = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                    lat += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
                    lat += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
                    lat += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
                    return lat;
                }

                function transformLonWithXY(x, y) {
                    var pi = 3.14159265358979324;
                    var lon = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                    lon += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
                    lon += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
                    lon += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
                    return lon;
                }



