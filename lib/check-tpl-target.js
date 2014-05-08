/**
 * @file ����ظ���target����
 *
 * @author ielgnaw(wuji0223@gmail.com)
 */
var edp = require( 'edp-core' );

/**
 * ��Ŀ���ȵ�target�洢
 *
 * @type {Object}
 */
var allTargets = {};

/**
 * ���ģ���ļ��е�target
 *
 * @param  {string} file �ļ�·��
 */
function checkTplTarget( file ) {
    var data = edp.fs.readFileSync( file );
    var pattern = /^(<\!--\s+target:\s+)(\b\w+\b)/gm;
    var invalidResource = [];
    var tmp = {};
    while ( !!( match = pattern.exec( data ) ) ) {
        var curMatch = match[ 2 ];
        if ( !tmp[ curMatch ] ) {
            tmp[ curMatch ] = true;
            if ( !allTargets[ curMatch ] ) {
                allTargets[ curMatch ] = [];
            }
            allTargets[ curMatch ].push( file );
        }
        // �ڵ�ǰ�ļ���target�Ѿ��ظ��ˣ�ֱ���׳���Ϣ
        // �����ټ�������ļ����Ƿ���������target�ˣ�
        // ���Ҫ��allTargets��ȥ����ǰtarget��Ӧ������ļ���
        else {
            allTargets[ curMatch ].splice(
                allTargets[ curMatch ].indexOf( curMatch ),
                1
            );
            invalidResource.push( curMatch );
        }
    }

    if ( invalidResource.length ) {
        edp.log.info( '%s', file );
        invalidResource.forEach(
            function ( name ) {
                edp.log.error( '�� Target name `%s` is already exist', name );
            }
        );
    }
}

module.exports = exports = function(args, opts) {
    edp.log.info( 'Checking tpl target...' );

    var util = require('./util');

    var candidates = util.getCandidates(
        args,
        [ 'src/**/*.tpl', 'src/**/*.tpl.html' ]
    );

    if ( candidates.length ) {
        candidates.forEach(
            function (item) {
                if ( util.isIgnored( item ) ) {
                    return;
                }
                checkTplTarget( item );
            }
        );
    }

    Object.keys( allTargets ).forEach(
        function ( name ) {
            if ( allTargets[ name ].length > 1 ) {
                edp.log.info( '%s', allTargets[name].map(
                    function ( item ) {
                        return item;
                    }
                ));
                edp.log.error( '�� Target name `%s` is already exist', name );
            }
        }
    );
};