﻿/*global require*/
define([
    'scalejs!application/main',
    'scalejs.windowfactory'
], function (
    application
) {
    'use strict';

    windowfactory.onReady(function () {
        application.run();
    });
});
