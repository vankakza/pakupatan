(function(){
    var script = {
 "scrollBarMargin": 2,
 "paddingLeft": 0,
 "id": "rootPlayer",
 "children": [
  "this.MainViewer",
  "this.IconButton_9B0450A3_8DC8_D682_41AC_A74286638EB4",
  "this.veilPopupPanorama",
  "this.zoomImagePopupPanorama",
  "this.closeButtonPopupPanorama"
 ],
 "scrollBarVisible": "rollOver",
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_9B0450A3_8DC8_D682_41AC_A74286638EB4], 'cardboardAvailable')",
 "layout": "absolute",
 "width": "100%",
 "class": "Player",
 "scripts": {
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "existsKey": function(key){  return key in window; },
  "unregisterKey": function(key){  delete window[key]; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "registerKey": function(key, value){  window[key] = value; },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getKey": function(key){  return window[key]; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } }
 },
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "defaultVRPointer": "laser",
 "downloadEnabled": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minHeight": 20,
 "height": "100%",
 "shadow": false,
 "contentOpaque": false,
 "minWidth": 20,
 "borderRadius": 0,
 "borderSize": 0,
 "definitions": [{
 "levels": [
  {
   "url": "media/popup_98663F2D_8733_1CD4_41BF_0453E520DB57_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_98663F2D_8733_1CD4_41BF_0453E520DB57_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_98663F2D_8733_1CD4_41BF_0453E520DB57_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_98663F2D_8733_1CD4_41BF_0453E520DB57_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3E88F41_872D_3B4F_41C3_806E2B1B4FE0",
 "class": "ImageResource"
},
{
 "levels": [
  {
   "url": "media/popup_9F4C096D_8753_2754_41D2_0F82281B76AC_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_9F4C096D_8753_2754_41D2_0F82281B76AC_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_9F4C096D_8753_2754_41D2_0F82281B76AC_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_9F4C096D_8753_2754_41D2_0F82281B76AC_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_9AE21A12_873D_64CD_41DB_F0F43B87397A",
 "class": "ImageResource"
},
{
 "items": [
  {
   "media": "this.panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_camera"
  },
  {
   "media": "this.panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_camera"
  },
  {
   "media": "this.panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_camera"
  },
  {
   "media": "this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_camera"
  },
  {
   "media": "this.panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_camera"
  },
  {
   "media": "this.panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_camera"
  },
  {
   "media": "this.panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_camera"
  },
  {
   "media": "this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_camera"
  },
  {
   "media": "this.panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_camera"
  },
  {
   "media": "this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_camera"
  },
  {
   "media": "this.panorama_88036993_86BB_D51A_41BE_3881D96313A7",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_88036993_86BB_D51A_41BE_3881D96313A7_camera"
  },
  {
   "media": "this.panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_camera"
  },
  {
   "media": "this.panorama_89B030B2_86BB_B315_41D5_B6E317C390AF",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_camera"
  },
  {
   "media": "this.panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_camera"
  },
  {
   "media": "this.panorama_8ACC4819_86BC_7317_41B1_572973713036",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8ACC4819_86BC_7317_41B1_572973713036_camera"
  },
  {
   "media": "this.panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_camera"
  },
  {
   "media": "this.panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_camera"
  },
  {
   "media": "this.panorama_884B522F_86BC_F70B_41BE_AB0F60060908",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_884B522F_86BC_F70B_41BE_AB0F60060908_camera"
  },
  {
   "media": "this.panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_camera"
  },
  {
   "media": "this.panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_camera"
  },
  {
   "media": "this.panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_camera"
  },
  {
   "media": "this.panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_camera"
  },
  {
   "media": "this.panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_camera"
  },
  {
   "media": "this.panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_camera"
  },
  {
   "media": "this.panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_camera"
  },
  {
   "media": "this.panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_camera"
  },
  {
   "media": "this.panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_camera"
  },
  {
   "media": "this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_camera"
  },
  {
   "media": "this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_camera"
  },
  {
   "media": "this.panorama_8AD32B36_86BC_551D_41A0_F27558AA8279",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_camera"
  },
  {
   "media": "this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_camera"
  },
  {
   "media": "this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_camera"
  },
  {
   "media": "this.panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08",
   "end": "this.trigger('tourEnded')",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": -88.48,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B1DF4E7_8DCB_BE83_41BD_AEF05661A422",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 140.2,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -50.44,
   "panorama": "this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B"
  },
  {
   "yaw": -178.57,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 4.08,
   "panorama": "this.panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED"
  }
 ],
 "label": "20220924_201741_818",
 "id": "panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A",
 "overlays": [
  "this.overlay_95EDA5F5_86B4_7D1F_41E0_B4706FDE1441",
  "this.overlay_A89C822D_88F3_24D4_41AD_E7B3323828E5"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_t.jpg"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -176.32,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -177.25,
   "panorama": "this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294"
  }
 ],
 "label": "20220924_201038_001",
 "id": "panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75",
 "overlays": [
  "this.overlay_9FF152F7_8753_6534_41DF_9E327FCFE352"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_t.jpg"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_884B522F_86BC_F70B_41BE_AB0F60060908_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 86.61,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_97130E4D_8DCB_CD86_41D4_4933F6CD9F32",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -2.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9ACA1671_8DCB_BD9E_41D4_F353CE7C8622",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200928_838",
 "id": "panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_A751F1C3_8733_674C_41DC_98D6EDF2790A",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_A751F1C3_8733_674C_41DC_98D6EDF2790A_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 7.1,
 "rotationZ": 0,
 "yaw": -163.39,
 "pitch": 1.84
},
{
 "initialPosition": {
  "yaw": 90.71,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AEB85F5_8DCB_BE86_41B1_F0FDBD23D1DC",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3E7CF51_872D_3B4C_4198_292824ACA5F4",
 "class": "ImageResource"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -7.07,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B0CB54A_8DCB_BF82_41D9_C7146EF7EB1D",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200755_617",
 "id": "panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_camera",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_98544939_873F_273C_41DB_0407BA8BEE71_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_98544939_873F_273C_41DB_0407BA8BEE71_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_98544939_873F_273C_41DB_0407BA8BEE71_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_98544939_873F_273C_41DB_0407BA8BEE71_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3EE6F41_872D_3B4F_41D0_91A716500752",
 "class": "ImageResource"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -15.02,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 96.43,
   "panorama": "this.panorama_884B522F_86BC_F70B_41BE_AB0F60060908"
  },
  {
   "yaw": -108.84,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -69.25,
   "panorama": "this.panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74"
  }
 ],
 "label": "20220924_200905_379",
 "id": "panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752",
 "overlays": [
  "this.overlay_9390839E_8777_2BF4_41BB_A8C916788182",
  "this.overlay_92E2905C_8775_2574_41CD_CFC2E0C50C12",
  "this.overlay_9860554A_8735_EF5D_41DC_EB366991BD01",
  "this.popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363",
  "this.overlay_989BF54F_8735_6F54_41DB_AD9F8F1FD419",
  "this.popup_9804CAC2_8735_254C_41DF_FD69CB9297FB"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_t.jpg"
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_9804CAC2_8735_254C_41DF_FD69CB9297FB",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_9804CAC2_8735_254C_41DF_FD69CB9297FB_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 14.41,
 "rotationZ": 0,
 "yaw": -137.14,
 "pitch": 8.77
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200627_764",
 "id": "panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "initialPosition": {
  "yaw": 72.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9732ED90_8DCB_CE9E_41E0_C407AF208225",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200644_808",
 "id": "panorama_89B030B2_86BB_B315_41D5_B6E317C390AF",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200737_234",
 "id": "panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8ACA6B50_86BC_5515_41AC_AAAC8FDEBBCA_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "initialPosition": {
  "yaw": 3.68,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AD1861F_8DCB_BD82_41B4_AA4F01C1B411",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 14.47,
 "rotationZ": 0,
 "yaw": -6.21,
 "pitch": 6.95
},
{
 "levels": [
  {
   "url": "media/popup_9845FD4F_8735_3F54_41D5_750F8197E58F_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_9845FD4F_8735_3F54_41D5_750F8197E58F_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_9845FD4F_8735_3F54_41D5_750F8197E58F_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_9845FD4F_8735_3F54_41D5_750F8197E58F_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3F5BF41_872D_3B4F_41D8_139E6AA8B555",
 "class": "ImageResource"
},
{
 "initialPosition": {
  "yaw": 173.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96EE8F40_8DCB_CBFE_41DF_D509EC8AC89C",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -175.03,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 101.02,
   "panorama": "this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429"
  },
  {
   "yaw": -79.07,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -72.45,
   "panorama": "this.panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72"
  },
  {
   "yaw": -0.05,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 172.71,
   "panorama": "this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941"
  }
 ],
 "label": "20220924_202026_807",
 "id": "panorama_8836E539_86BF_FD17_41C8_DCFB05040C19",
 "overlays": [
  "this.overlay_969C34F7_872D_2D33_41E0_B8F4FF5F2CA8",
  "this.overlay_9568AB11_8753_64CC_41B4_B2BF3B6A78C7",
  "this.overlay_95A932C1_8757_654C_41D5_8FF3C5737F49",
  "this.overlay_980CCEC5_873D_1D54_41D1_20124EA2B2D3",
  "this.popup_9890F8D3_873D_E573_41A8_BD1496038844"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_t.jpg"
},
{
 "initialPosition": {
  "yaw": -175.92,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96A4F057_8DCB_B582_41D6_71F25620F4A7",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3E5AF51_872D_3B4C_41C6_E0BF6E185999",
 "class": "ImageResource"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -95.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_965EA1C0_8DCB_B6FE_41D2_24652741A45B",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 164.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AA6A6BA_8DCB_BA82_41B6_9B240F32BD75",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 78.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_972FEE12_8DCB_CD82_41D8_23AB111D544B",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 174.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AE525CD_8DCB_BE86_41D3_9708E99CBBD5",
 "automaticZoomSpeed": 10
},
{
 "touchControlMode": "drag_rotation",
 "buttonCardboardView": "this.IconButton_9B0450A3_8DC8_D682_41AC_A74286638EB4",
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration",
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "gyroscopeVerticalDraggingEnabled": true
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_98663F2D_8733_1CD4_41BF_0453E520DB57",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_98663F2D_8733_1CD4_41BF_0453E520DB57_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 14.56,
 "rotationZ": 0,
 "yaw": -18.89,
 "pitch": 2.86
},
{
 "initialPosition": {
  "yaw": 95.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_968B510C_8DCB_B786_4196_EF71F8201670",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -65.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9609E2D5_8DCB_BA86_41C9_A6CF0D845B28",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3F01F41_872D_3B4F_41B9_13BA0BB19A76",
 "class": "ImageResource"
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200720_109",
 "id": "panorama_8ACC4819_86BC_7317_41B1_572973713036",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8ACC4819_86BC_7317_41B1_572973713036_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "initialPosition": {
  "yaw": 174.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AAFE6DC_8DCB_BA86_41CB_A20A1B0BD922",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_9F4C096D_8753_2754_41D2_0F82281B76AC",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_9F4C096D_8753_2754_41D2_0F82281B76AC_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 11.32,
 "rotationZ": 0,
 "yaw": -2.97,
 "pitch": 9.22
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 89.88,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -5.84,
   "panorama": "this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0"
  },
  {
   "yaw": -84.8,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -89.29,
   "panorama": "this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941"
  },
  {
   "yaw": -177.25,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -176.32,
   "panorama": "this.panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75"
  }
 ],
 "label": "20220924_201658_258",
 "id": "panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294",
 "overlays": [
  "this.overlay_92766F9E_86DC_4D0A_41C2_19124A4431A7",
  "this.overlay_957CF54A_86DD_DD75_41CF_6047FA930111",
  "this.overlay_9EFFF5AA_8753_6FDD_41B5_95363B29C764"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_t.jpg"
},
{
 "initialPosition": {
  "yaw": 100.93,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A958707_8DCB_BB82_41D6_90AA75771F4F",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_89B11ED8_86BC_CF16_41D3_AC914379ACC0_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -89.3,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -167.03,
   "panorama": "this.panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08"
  },
  {
   "yaw": 96.43,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -15.02,
   "panorama": "this.panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752"
  }
 ],
 "label": "20220924_200843_544",
 "id": "panorama_884B522F_86BC_F70B_41BE_AB0F60060908",
 "overlays": [
  "this.overlay_9173EEE1_8773_3D4C_41DF_37AF650AC21C",
  "this.overlay_9134A8C0_876D_254C_41BB_63E04F82F1C0",
  "this.overlay_981CEA36_8737_2534_41DF_819107AFB10B",
  "this.popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_t.jpg"
},
{
 "initialPosition": {
  "yaw": 172.93,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A5CA820_8DCB_B5BE_41A1_A41A47942E64",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_98E8FAEB_873D_2553_4161_2BD881736DF9",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_98E8FAEB_873D_2553_4161_2BD881736DF9_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 7.11,
 "rotationZ": 0,
 "yaw": 114.32,
 "pitch": 0.47
},
{
 "initialPosition": {
  "yaw": 4.97,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B1344BD_8DCB_BE86_41CD_A089711D6FBB",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_9890F8D3_873D_E573_41A8_BD1496038844_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_9890F8D3_873D_E573_41A8_BD1496038844_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_9890F8D3_873D_E573_41A8_BD1496038844_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_9890F8D3_873D_E573_41A8_BD1496038844_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3E45F51_872D_3B4C_41DA_33C9B597579E",
 "class": "ImageResource"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 79.66,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -107.25,
   "panorama": "this.panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08"
  },
  {
   "yaw": -101.16,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -97.48,
   "panorama": "this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0"
  }
 ],
 "label": "20220924_200606_645",
 "id": "panorama_88036993_86BB_D51A_41BE_3881D96313A7",
 "overlays": [
  "this.overlay_90C46A47_86B4_777A_41B1_470323A835E2",
  "this.overlay_91D99D0A_8754_B2F5_41D1_951107F69733",
  "this.overlay_982FC3DE_8DC8_DA82_41D8_8A25FAD1755E",
  "this.popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_t.jpg"
},
{
 "initialPosition": {
  "yaw": -90.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9706BE8A_8DCB_CA83_41C9_DBC8FFBF7FA5",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -174.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9606B2AB_8DCB_BA82_41BD_8FB9E8CA5EC1",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -177.66,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96339229_8DCB_B58F_41D1_CC05997EC874",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_camera",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 12.24,
 "rotationZ": 0,
 "yaw": -8.18,
 "pitch": 4.09
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_886E7CA3_86BB_F33B_41D9_815E9E73875F_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_camera",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_9845FD4F_8735_3F54_41D5_750F8197E58F",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_9845FD4F_8735_3F54_41D5_750F8197E58F_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 14.53,
 "rotationZ": 0,
 "yaw": -98.25,
 "pitch": 4.91
},
{
 "initialPosition": {
  "yaw": -100.34,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96D17F88_8DCB_CA8E_41D7_5FD7FFF8238D",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_201002_416",
 "id": "panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8ADF906C_86BC_530D_41CE_DAD2670C6218_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -12.95,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 177.9,
   "panorama": "this.panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED"
  }
 ],
 "label": "20220924_201839_340",
 "id": "panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D",
 "overlays": [
  "this.overlay_90C39ADC_86BC_D70E_41C6_9DA95DFC9810",
  "this.overlay_90A2A914_8753_E4F4_41D4_600237C1FEFD",
  "this.popup_9F4C096D_8753_2754_41D2_0F82281B76AC"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_t.jpg"
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_9890F8D3_873D_E573_41A8_BD1496038844",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_9890F8D3_873D_E573_41A8_BD1496038844_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 7.1,
 "rotationZ": 0,
 "yaw": 103.07,
 "pitch": 2.91
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_88036993_86BB_D51A_41BE_3881D96313A7_camera",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_A751F1C3_8733_674C_41DC_98D6EDF2790A_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_A751F1C3_8733_674C_41DC_98D6EDF2790A_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_A751F1C3_8733_674C_41DC_98D6EDF2790A_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_A751F1C3_8733_674C_41DC_98D6EDF2790A_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3EA7F51_872D_3B4C_41DF_373D27AF8056",
 "class": "ImageResource"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -162.11,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -7.37,
   "panorama": "this.panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C"
  }
 ],
 "label": "SAM_100_1544",
 "id": "panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A",
 "overlays": [
  "this.overlay_9E23B303_8DC9_BB82_41D8_DA83A391D355"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_t.jpg"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -7.37,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -162.11,
   "panorama": "this.panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A"
  },
  {
   "yaw": 172.93,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -76.86,
   "panorama": "this.panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF"
  }
 ],
 "label": "SAM_100_1546_1662138000000",
 "id": "panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C",
 "overlays": [
  "this.overlay_9DBF3310_8DC7_DB9D_41D7_00D6F709BEB2",
  "this.overlay_9EEEB638_8DC8_BD8D_41D6_C8A59138198C"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_t.jpg"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_camera",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -7.29,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B2EE46E_8DCB_BD82_41DD_61B443BD0DE1",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 99.3,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -5.84,
   "panorama": "this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F"
  },
  {
   "yaw": -72.45,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -79.07,
   "panorama": "this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19"
  }
 ],
 "label": "20220924_202052_859",
 "id": "panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72",
 "overlays": [
  "this.overlay_9678C4D6_872F_2D75_41CE_1FCF04374CBE",
  "this.overlay_97B4FEA5_872F_FDD4_41D6_43C9A069FC3D",
  "this.overlay_988B016A_8735_275D_41B0_326EE3EC9692",
  "this.popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_t.jpg"
},
{
 "initialPosition": {
  "yaw": -172.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A986729_8DCB_BB8F_41AF_4C2B28C31BCA",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 172.71,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -0.05,
   "panorama": "this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19"
  },
  {
   "yaw": -6.18,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -174.16,
   "panorama": "this.panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1"
  },
  {
   "yaw": -89.29,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -84.8,
   "panorama": "this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294"
  }
 ],
 "label": "20220924_201625_043",
 "id": "panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941",
 "overlays": [
  "this.overlay_9D191D6A_8735_3F5C_41D5_E02C7BE0C629",
  "this.overlay_9D5450B4_8733_E534_41D3_3A334F69D74B",
  "this.overlay_999D1075_8753_2537_41E0_1A2D3A3DA884",
  "this.overlay_A7793960_873F_E74C_41C5_6E2080E6F218",
  "this.popup_98544939_873F_273C_41DB_0407BA8BEE71"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_t.jpg"
},
{
 "initialPosition": {
  "yaw": 179.95,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9697C09A_8DCB_B682_41D7_E407D581FCA6",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 4.08,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -178.57,
   "panorama": "this.panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A"
  },
  {
   "yaw": 177.9,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -12.95,
   "panorama": "this.panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D"
  }
 ],
 "label": "20220924_201803_025",
 "id": "panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED",
 "overlays": [
  "this.overlay_8901661B_86B4_5F0B_41CB_0CC399D844F4",
  "this.overlay_8940A6C5_86B5_FF7E_41D4_6D72C7E7193B"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_t.jpg"
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 13.36,
 "rotationZ": 0,
 "yaw": 13.78,
 "pitch": -0.4
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 114.84,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -7.07,
   "panorama": "this.panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B"
  },
  {
   "yaw": -69.25,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -108.84,
   "panorama": "this.panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752"
  }
 ],
 "label": "20220924_201100_590",
 "id": "panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74",
 "overlays": [
  "this.overlay_99CBD7BF_8DF8_5A82_4167_296CC74CF0C8",
  "this.overlay_9B8F7DD0_8DF8_CE9E_41E0_416048CC779D"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_t.jpg"
},
{
 "initialPosition": {
  "yaw": 71.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A43784B_8DCB_B582_41BA_236343E69291",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 91.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B283497_8DCB_BE82_41C9_A27F62070BFE",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_899BCA12_86BC_B71A_41DF_A5F8015BAED1_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -90.94,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A8E7757_8DCB_BB82_41DF_B51AA419B1AA",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_97532CE6_8DCB_CE82_41C6_70F4DB96E9F2",
 "class": "ImageResource"
},
{
 "initialPosition": {
  "yaw": -80.7,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_964161FD_8DCB_B686_41D8_AA48B0456F81",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -88.48,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -75.39,
   "panorama": "this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429"
  }
 ],
 "label": "20220924_201938_770",
 "id": "panorama_8AD32B36_86BC_551D_41A0_F27558AA8279",
 "overlays": [
  "this.overlay_99B8FF05_87F5_3CD4_41B8_7C94B7C50BE8",
  "this.overlay_980426A1_8733_6DCF_41C2_FCA596FAAB5C",
  "this.popup_98663F2D_8733_1CD4_41BF_0453E520DB57",
  "this.overlay_98154E66_8733_3D55_41DE_B9635B62E857",
  "this.popup_A751F1C3_8733_674C_41DC_98D6EDF2790A"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_t.jpg"
},
{
 "initialPosition": {
  "yaw": 82.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_97380DCF_8DCB_CE83_41B0_0DBDC7F0210E",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200945_267",
 "id": "panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8854CD28_86BC_4D36_41D3_2B167CC7D2FC_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "initialPosition": {
  "yaw": -6.66,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96FFCEF4_8DCB_CA85_41B8_1419EE849E3C",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 5.1,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 173.34,
   "panorama": "this.panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B"
  },
  {
   "yaw": -174.16,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 173.34,
   "panorama": "this.panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B"
  },
  {
   "yaw": -174.16,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -6.18,
   "panorama": "this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941"
  }
 ],
 "label": "20220924_201601_305",
 "id": "panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1",
 "overlays": [
  "this.overlay_A7FD3910_873D_64CC_41DC_4D59F0625E78",
  "this.popup_98C663D8_873D_2B7C_41E0_D0692A48CA27",
  "this.overlay_A9D6D15B_88D5_2773_41DC_B120D47AE8C0",
  "this.overlay_AA6C9C28_88D3_1CDC_41AC_3C7058C54F50"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_t.jpg"
},
{
 "initialPosition": {
  "yaw": 1.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9622025D_8DCB_B586_41E0_138A7C5BCCAD",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_camera",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_9804CAC2_8735_254C_41DF_FD69CB9297FB_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_9804CAC2_8735_254C_41DF_FD69CB9297FB_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_9804CAC2_8735_254C_41DF_FD69CB9297FB_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_9804CAC2_8735_254C_41DF_FD69CB9297FB_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3F31F41_872D_3B4F_41D0_866C4C27748A",
 "class": "ImageResource"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -75.39,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -88.48,
   "panorama": "this.panorama_8AD32B36_86BC_551D_41A0_F27558AA8279"
  },
  {
   "yaw": 101.02,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -175.03,
   "panorama": "this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19"
  },
  {
   "yaw": 7.25,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 91.52,
   "panorama": "this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B"
  }
 ],
 "label": "20220924_202001_257",
 "id": "panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429",
 "overlays": [
  "this.overlay_9D8002B6_873D_2535_41DB_834F9CF5509F",
  "this.overlay_9B52EF3D_8733_7B34_41DD_42A0D0F070A4",
  "this.overlay_9CA0A3B7_8735_2B34_41CD_B075572D9939",
  "this.overlay_A7FC2C6B_8733_1D53_41CF_0BE794FAC086",
  "this.popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_t.jpg"
},
{
 "levels": [
  {
   "url": "media/popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_9741BD3A_8DCB_CF82_41E0_11A39DF8D856",
 "class": "ImageResource"
},
{
 "initialPosition": {
  "yaw": 129.56,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96B2000F_8DCB_B582_41D7_F31E9FAA4905",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -83.57,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_967DF14B_8DCB_B782_41B5_F37737B818E4",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 104.61,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A5457F8_8DCB_BA8D_41B1_09A42AA3B7A1",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -175.83,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -171.17,
   "panorama": "this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B"
  },
  {
   "yaw": -76.86,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 172.93,
   "panorama": "this.panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C"
  },
  {
   "panorama": "this.panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D",
   "class": "AdjacentPanorama"
  }
 ],
 "label": "20220924_200518_856",
 "id": "panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF",
 "overlays": [
  "this.overlay_90546473_876E_ED4C_41C4_D18EBD41242F",
  "this.overlay_905E0469_876D_2D5C_41D1_77903D4B2340",
  "this.overlay_98037F63_8735_1B4C_41D0_EFA77AB9C424",
  "this.popup_9845FD4F_8735_3F54_41D5_750F8197E58F",
  "this.overlay_82E187A2_8DC8_7A82_41DC_1FB087C1EB35"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_t.jpg"
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_98C663D8_873D_2B7C_41E0_D0692A48CA27",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_98C663D8_873D_2B7C_41E0_D0692A48CA27_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 7.07,
 "rotationZ": 0,
 "yaw": 104.39,
 "pitch": 5.89
},
{
 "initialPosition": {
  "yaw": 103.14,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AFF15A5_8DCB_BE87_41E0_655928A9DC49",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 4.17,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A74E77A_8DCB_BB83_41DA_EF0C5510F8B1",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 14.5,
 "rotationZ": 0,
 "yaw": -155.08,
 "pitch": 6.48
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -78.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_91FAF2FE_8DCB_BA85_41B7_3A6EFA4DFF5A",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -39.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A7AF7A2_8DCB_BA82_419C_4DBD0ABD3E4D",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_camera",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_98E8FAEB_873D_2553_4161_2BD881736DF9_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_98E8FAEB_873D_2553_4161_2BD881736DF9_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_98E8FAEB_873D_2553_4161_2BD881736DF9_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_98E8FAEB_873D_2553_4161_2BD881736DF9_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3F2BF41_872D_3B4F_41C7_8C3F6E2280DA",
 "class": "ImageResource"
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 11.68,
 "rotationZ": 0,
 "yaw": 4.12,
 "pitch": 4.68
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -107.25,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 79.66,
   "panorama": "this.panorama_88036993_86BB_D51A_41BE_3881D96313A7"
  },
  {
   "yaw": -167.03,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -89.3,
   "panorama": "this.panorama_884B522F_86BC_F70B_41BE_AB0F60060908"
  }
 ],
 "label": "20220927_102122_509",
 "id": "panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08",
 "overlays": [
  "this.overlay_92AB9F1A_8755_3CFD_41C7_1404F3132C5A",
  "this.overlay_98B268F1_87ED_E54F_41C7_F6227A3C1932",
  "this.overlay_9B6DE5F1_8DD8_5E9E_41B9_4F72A1ACEA88",
  "this.popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_t.jpg"
},
{
 "initialPosition": {
  "yaw": 2.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AC4764B_8DCB_BD82_41D6_AAAA4FFFC083",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3F68F41_872D_3B4F_41C9_40E490D9E6AA",
 "class": "ImageResource"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -97.48,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -101.16,
   "panorama": "this.panorama_88036993_86BB_D51A_41BE_3881D96313A7"
  },
  {
   "yaw": 84.16,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -93.39,
   "panorama": "this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F"
  },
  {
   "yaw": -5.84,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 89.88,
   "panorama": "this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294"
  }
 ],
 "label": "20220924_201719_814",
 "id": "panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0",
 "overlays": [
  "this.overlay_95FED02A_86D5_D335_41D2_D1A84AD6E834",
  "this.overlay_949E700A_86DC_D2F5_41CE_B4FB3C0523C6",
  "this.overlay_9925B3DA_872F_2B7D_41DD_E1A5ACFAAF85",
  "this.overlay_999A94EF_872F_ED53_41A0_DEA748214527",
  "this.overlay_AC185CF1_8955_3D4C_4180_DB7331AC64FB"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_t.jpg"
},
{
 "initialPosition": {
  "yaw": 17.89,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AF70575_8DCB_BF87_41C5_786A0552C480",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 172.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A61A7CC_8DCB_BA86_419C_2A902C34084F",
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -6.66,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_970A6EC4_8DCB_CA86_41DD_3FA28AC17CBE",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_camera",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 11.64,
 "rotationZ": 0,
 "yaw": 137.18,
 "pitch": 6.55
},
{
 "initialPosition": {
  "yaw": 90.7,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96C3EFCF_8DCB_CA82_41B7_6F6E5E5BE6E4",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 8.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B04351B_8DCB_BF83_41E0_215A3B301F73",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 173.34,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 5.1,
   "panorama": "this.panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1"
  },
  {
   "yaw": -7.07,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 114.84,
   "panorama": "this.panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74"
  }
 ],
 "label": "20220924_201122_289",
 "id": "panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B",
 "overlays": [
  "this.overlay_982A02E8_8732_E55D_41D9_C97C9CE44528",
  "this.popup_98E8FAEB_873D_2553_4161_2BD881736DF9",
  "this.overlay_AA55BA05_892D_24D7_41D0_317621F6F7CF",
  "this.overlay_AC443EF6_892F_FD35_41D0_31DE6852D4F6"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_t.jpg"
},
{
 "initialPosition": {
  "yaw": 5.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9698C0DA_8DCB_B682_41D6_25AC5D2EA6CF",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_201020_703",
 "id": "panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8A38E3AC_86BD_B50E_41CB_B235346A714E_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": -93.39,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 84.16,
   "panorama": "this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0"
  },
  {
   "yaw": -5.84,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 99.3,
   "panorama": "this.panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72"
  },
  {
   "yaw": 89.06,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 2.34,
   "panorama": "this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B"
  }
 ],
 "label": "20220924_202118_705",
 "id": "panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F",
 "overlays": [
  "this.overlay_889849F2_8733_274C_41C5_20DE8F8CD49B",
  "this.overlay_960BDF4A_8732_FB5C_41A2_9838407CF0FA",
  "this.overlay_967BDC18_872D_3CFC_41BB_B49C1DECA5EF"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_t.jpg"
},
{
 "initialPosition": {
  "yaw": 167.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_96142283_8DCB_BA82_41E0_B8F02E763E23",
 "automaticZoomSpeed": 10
},
{
 "levels": [
  {
   "url": "media/popup_98C663D8_873D_2B7C_41E0_D0692A48CA27_0_0.jpg",
   "width": 4080,
   "class": "ImageResourceLevel",
   "height": 3072
  },
  {
   "url": "media/popup_98C663D8_873D_2B7C_41E0_D0692A48CA27_0_1.jpg",
   "width": 2048,
   "class": "ImageResourceLevel",
   "height": 1542
  },
  {
   "url": "media/popup_98C663D8_873D_2B7C_41E0_D0692A48CA27_0_2.jpg",
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 771
  },
  {
   "url": "media/popup_98C663D8_873D_2B7C_41E0_D0692A48CA27_0_3.jpg",
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "ImageResource_A3EC6F41_872D_3B4F_41D1_E9B3F2202E10",
 "class": "ImageResource"
},
{
 "initialPosition": {
  "yaw": 110.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_966C717E_8DCB_B782_41C4_E1D0A818D2B0",
 "automaticZoomSpeed": 10
},
{
 "rotationY": 0,
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "popupMaxHeight": "95%",
 "showEasing": "cubic_in",
 "showDuration": 500,
 "id": "popup_98544939_873F_273C_41DB_0407BA8BEE71",
 "popupDistance": 100,
 "rotationX": 0,
 "hideDuration": 500,
 "hideEasing": "cubic_out",
 "image": {
  "levels": [
   {
    "url": "media/popup_98544939_873F_273C_41DB_0407BA8BEE71_0_2.jpg",
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 771
   }
  ],
  "class": "ImageResource"
 },
 "hfov": 14.57,
 "rotationZ": 0,
 "yaw": 76.43,
 "pitch": 2.45
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8ACC4819_86BC_7317_41B1_572973713036_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "yaw": 91.52,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 7.25,
   "panorama": "this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429"
  },
  {
   "yaw": 2.34,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 89.06,
   "panorama": "this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F"
  },
  {
   "yaw": -171.17,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -175.83,
   "panorama": "this.panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF"
  },
  {
   "yaw": -50.44,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 140.2,
   "panorama": "this.panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A"
  }
 ],
 "label": "20220924_201917_380",
 "id": "panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B",
 "overlays": [
  "this.overlay_8AA540D9_873D_257F_41B0_D4BA1D778B9E",
  "this.overlay_8ADB45C6_8735_6F55_41AF_7283681BFC99",
  "this.overlay_9E419280_8755_25CD_41A4_30127A7559BA",
  "this.overlay_9FC03247_8DC9_D582_4175_5D9C9316FA19"
 ],
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "hfov": 360,
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_t.jpg"
},
{
 "initialPosition": {
  "yaw": 107.55,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B226446_8DCB_BD82_41E1_457523B0A9D6",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_89B030B2_86BB_B315_41D5_B6E317C390AF_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 12.97,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AB0E697_8DCB_BA82_41DE_95832E780939",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "vfov": 180,
 "label": "20220924_200702_151",
 "id": "panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6",
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "left": {
    "levels": [
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "class": "TiledImageResourceLevel",
      "height": 2048
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "partial": false,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_t.jpg",
 "class": "Panorama",
 "hfov": 360
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_8ACA0467_86BC_533B_41B4_F1992385C2C6_camera",
 "automaticZoomSpeed": 10
},
{
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "id": "MainViewer",
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "width": "100%",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "class": "ViewerArea",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "minHeight": 50,
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionDuration": 500,
 "playbackBarProgressBorderColor": "#000000",
 "shadow": false,
 "paddingRight": 0,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "height": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "minWidth": 100,
 "borderSize": 0,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "toolTipBackgroundColor": "#F6F6F6",
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "transitionMode": "blending",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "playbackBarBottom": 5,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderColor": "#767676",
 "data": {
  "name": "Main Viewer"
 },
 "toolTipShadowSpread": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical"
},
{
 "maxHeight": 42,
 "paddingLeft": 0,
 "id": "IconButton_9B0450A3_8DC8_D682_41AC_A74286638EB4",
 "width": 42,
 "horizontalAlign": "center",
 "right": "2.81%",
 "class": "IconButton",
 "maxWidth": 42,
 "minHeight": 1,
 "verticalAlign": "middle",
 "height": 42,
 "paddingRight": 0,
 "mode": "push",
 "backgroundOpacity": 0,
 "shadow": false,
 "minWidth": 1,
 "bottom": "4.82%",
 "borderRadius": 0,
 "borderSize": 0,
 "iconURL": "skin/IconButton_9B0450A3_8DC8_D682_41AC_A74286638EB4.png",
 "propagateClick": false,
 "paddingTop": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton15327"
 },
 "paddingBottom": 0,
 "cursor": "hand"
},
{
 "paddingLeft": 0,
 "id": "veilPopupPanorama",
 "left": 0,
 "showEffect": {
  "duration": 350,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "right": 0,
 "minHeight": 0,
 "class": "UIComponent",
 "top": 0,
 "backgroundColor": [
  "#000000"
 ],
 "backgroundOpacity": 0.55,
 "paddingRight": 0,
 "shadow": false,
 "minWidth": 0,
 "bottom": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "propagateClick": false,
 "paddingTop": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "UIComponent27524"
 },
 "visible": false,
 "paddingBottom": 0,
 "backgroundColorDirection": "vertical"
},
{
 "paddingLeft": 0,
 "id": "zoomImagePopupPanorama",
 "left": 0,
 "right": 0,
 "minHeight": 0,
 "class": "ZoomImage",
 "top": 0,
 "backgroundColor": [],
 "backgroundOpacity": 1,
 "paddingRight": 0,
 "shadow": false,
 "minWidth": 0,
 "bottom": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "propagateClick": false,
 "paddingTop": 0,
 "backgroundColorRatios": [],
 "scaleMode": "custom",
 "data": {
  "name": "ZoomImage27525"
 },
 "visible": false,
 "paddingBottom": 0,
 "backgroundColorDirection": "vertical"
},
{
 "iconWidth": 20,
 "paddingLeft": 5,
 "id": "closeButtonPopupPanorama",
 "showEffect": {
  "duration": 350,
  "class": "FadeInEffect",
  "easing": "cubic_in_out"
 },
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "right": 10,
 "fontFamily": "Arial",
 "iconHeight": 20,
 "shadowColor": "#000000",
 "shadowBlurRadius": 6,
 "class": "CloseButton",
 "borderColor": "#000000",
 "iconLineWidth": 5,
 "top": 10,
 "verticalAlign": "middle",
 "iconBeforeLabel": true,
 "backgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "pressedIconColor": "#888888",
 "paddingRight": 5,
 "mode": "push",
 "minHeight": 0,
 "shadow": false,
 "minWidth": 0,
 "layout": "horizontal",
 "fontSize": "1.29vmin",
 "borderRadius": 0,
 "shadowSpread": 1,
 "borderSize": 0,
 "label": "",
 "propagateClick": false,
 "paddingTop": 5,
 "backgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "rollOverIconColor": "#666666",
 "iconColor": "#000000",
 "fontStyle": "normal",
 "gap": 5,
 "textDecoration": "none",
 "visible": false,
 "data": {
  "name": "CloseButton27526"
 },
 "paddingBottom": 5,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B, this.camera_96B2000F_8DCB_B582_41D7_F31E9FAA4905); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 140.2,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.55,
   "hfov": 19.14
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F866ED_8DD8_BA86_41D6_33A5B2D29BA0",
   "yaw": 140.2,
   "pitch": -24.55,
   "hfov": 19.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_95EDA5F5_86B4_7D1F_41E0_B4706FDE1441",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED, this.camera_96A4F057_8DCB_B582_41D6_71F25620F4A7); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -178.57,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.29,
   "hfov": 20.56
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99FBC6ED_8DD8_BA86_41DA_80C70E9D61FC",
   "yaw": -178.57,
   "pitch": -12.29,
   "hfov": 20.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A89C822D_88F3_24D4_41AD_E7B3323828E5",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294, this.camera_9AC4764B_8DCB_BD82_41D6_AAAA4FFFC083); this.mainPlayList.set('selectedIndex', 28)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -176.32,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.64,
   "hfov": 12.27
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -176.32,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75_1_HS_0_0.png",
      "width": 207,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.64,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.27
  }
 ],
 "id": "overlay_9FF152F7_8753_6534_41DF_9E327FCFE352",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_884B522F_86BC_F70B_41BE_AB0F60060908, this.camera_967DF14B_8DCB_B782_41B5_F37737B818E4); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -15.02,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.66,
   "hfov": 20.18
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F646FD_8DD8_BA87_41D7_D01A251E956E",
   "yaw": -15.02,
   "pitch": -16.66,
   "hfov": 20.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9390839E_8777_2BF4_41BB_A8C916788182",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74, this.camera_966C717E_8DCB_B782_41C4_E1D0A818D2B0); this.mainPlayList.set('selectedIndex', 24)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -108.84,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.57,
   "hfov": 20.48
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F196FD_8DD8_BA87_41DF_E0C507BED69C",
   "yaw": -108.84,
   "pitch": -13.57,
   "hfov": 20.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_92E2905C_8775_2574_41CD_CFC2E0C50C12",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_98BF41ED_8735_2754_41C9_9FB0DFAF4363, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3F01F41_872D_3B4F_41B9_13BA0BB19A76, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 137.18,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_2_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.55,
   "hfov": 11.64
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 137.18,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_2_0.png",
      "width": 197,
      "class": "ImageResourceLevel",
      "height": 165
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.55,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.64
  }
 ],
 "id": "overlay_9860554A_8735_EF5D_41DC_EB366991BD01",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_9804CAC2_8735_254C_41DF_FD69CB9297FB, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3F31F41_872D_3B4F_41D0_866C4C27748A, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -137.14,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_3_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 8.77,
   "hfov": 14.41
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -137.14,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_3_0.png",
      "width": 246,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 8.77,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.41
  }
 ],
 "id": "overlay_989BF54F_8735_6F54_41DB_AD9F8F1FD419",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72, this.camera_9B226446_8DCB_BD82_41E1_457523B0A9D6); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -79.07,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.82,
   "hfov": 19.91
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_9988870C_8DD8_BB86_41C9_6C9CFFDBF5E2",
   "yaw": -79.07,
   "pitch": -18.82,
   "hfov": 19.91,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_969C34F7_872D_2D33_41E0_B8F4FF5F2CA8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941, this.camera_9B2EE46E_8DCB_BD82_41DD_61B443BD0DE1); this.mainPlayList.set('selectedIndex', 27)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -0.05,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.81,
   "hfov": 20.43
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_9988F70C_8DD8_BB86_41BF_081C7DAB76EC",
   "yaw": -0.05,
   "pitch": -13.81,
   "hfov": 20.43,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9568AB11_8753_64CC_41B4_B2BF3B6A78C7",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429, this.camera_91FAF2FE_8DCB_BA85_41B7_3A6EFA4DFF5A); this.mainPlayList.set('selectedIndex', 30)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -175.03,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.73,
   "hfov": 20.35
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_9988470C_8DD8_BB86_41C8_14CCCB36FFFE",
   "yaw": -175.03,
   "pitch": -14.73,
   "hfov": 20.35,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_95A932C1_8757_654C_41D5_8FF3C5737F49",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_9890F8D3_873D_E573_41A8_BD1496038844, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3E45F51_872D_3B4C_41DA_33C9B597579E, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 103.07,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_3_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.91,
   "hfov": 7.1
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 103.07,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_3_0.png",
      "width": 120,
      "class": "ImageResourceLevel",
      "height": 100
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.91,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.1
  }
 ],
 "id": "overlay_980CCEC5_873D_1D54_41D1_20124EA2B2D3",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0, this.camera_9AE525CD_8DCB_BE86_41D3_9708E99CBBD5); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 89.88,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18,
   "hfov": 20.01
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998CD70C_8DD8_BB86_41C6_3B656A6542BF",
   "yaw": 89.88,
   "pitch": -18,
   "hfov": 20.01,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_92766F9E_86DC_4D0A_41C2_19124A4431A7",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941, this.camera_9AEB85F5_8DCB_BE86_41B1_F0FDBD23D1DC); this.mainPlayList.set('selectedIndex', 27)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -84.8,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.27,
   "hfov": 20.56
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998C370C_8DD8_BB86_41AF_6963F85FD338",
   "yaw": -84.8,
   "pitch": -12.27,
   "hfov": 20.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_957CF54A_86DD_DD75_41CF_6047FA930111",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8864772A_86BD_DD0A_41D2_8F54F789CB75, this.camera_9AD1861F_8DCB_BD82_41B4_AA4F01C1B411); this.mainPlayList.set('selectedIndex', 23)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -177.25,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.86,
   "hfov": 20.59
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998F870C_8DD8_BB86_41DD_EE333D14BAF6",
   "yaw": -177.25,
   "pitch": -11.86,
   "hfov": 20.59,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9EFFF5AA_8753_6FDD_41B5_95363B29C764",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752, this.camera_9AA6A6BA_8DCB_BA82_41B6_9B240F32BD75); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 96.43,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.59,
   "hfov": 20.06
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F736ED_8DD8_BA86_41DC_40377BE7A908",
   "yaw": 96.43,
   "pitch": -17.59,
   "hfov": 20.06,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9173EEE1_8773_3D4C_41DF_37AF650AC21C",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08, this.camera_9AB0E697_8DCB_BA82_41DE_95832E780939); this.mainPlayList.set('selectedIndex', 32)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -89.3,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.32,
   "hfov": 20.39
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F686ED_8DD8_BA86_41D6_2A29687F69CB",
   "yaw": -89.3,
   "pitch": -14.32,
   "hfov": 20.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9134A8C0_876D_254C_41BB_63E04F82F1C0",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_98BFDF11_8736_FCCC_41DD_F4D1CF9C9C99, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3F68F41_872D_3B4F_41C9_40E490D9E6AA, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -6.21,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_1_HS_2_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.95,
   "hfov": 14.47
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -6.21,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_1_HS_2_0.png",
      "width": 246,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.95,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.47
  }
 ],
 "id": "overlay_981CEA36_8737_2534_41DF_819107AFB10B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08, this.camera_9732ED90_8DCB_CE9E_41E0_C407AF208225); this.mainPlayList.set('selectedIndex', 32)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 79.66,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.09,
   "hfov": 19.49
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F6E6ED_8DD8_BA86_41D9_9CD822922A92",
   "yaw": 79.66,
   "pitch": -22.09,
   "hfov": 19.49,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_90C46A47_86B4_777A_41B1_470323A835E2",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0, this.camera_97380DCF_8DCB_CE83_41B0_0DBDC7F0210E); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -101.16,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.18,
   "hfov": 18.88
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F7C6ED_8DD8_BA86_41CE_A0AAAFC8420B",
   "yaw": -101.16,
   "pitch": -26.18,
   "hfov": 18.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_91D99D0A_8754_B2F5_41D1_951107F69733",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_986A69A4_8DC8_B685_41C8_9E0B61D2EAFF, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_97532CE6_8DCB_CE82_41C6_70F4DB96E9F2, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -8.18,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.09,
   "hfov": 12.24
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -8.18,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_0_HS_2_0.png",
      "width": 207,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.09,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.24
  }
 ],
 "id": "overlay_982FC3DE_8DC8_DA82_41D8_8A25FAD1755E",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED, this.camera_9ACA1671_8DCB_BD9E_41D4_F353CE7C8622); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -12.95,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.59,
   "hfov": 9.74
  }
 ],
 "data": {
  "label": "Arrow 05b Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99FED6DD_8DD8_BA86_41C2_A4DC0A91999D",
   "yaw": -12.95,
   "pitch": -11.59,
   "hfov": 9.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_90C39ADC_86BC_D70E_41C6_9DA95DFC9810",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_9F4C096D_8753_2754_41D2_0F82281B76AC, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_9AE21A12_873D_64CD_41DB_F0F43B87397A, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -2.97,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_1_HS_1_0_0_map.gif",
      "width": 17,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 9.22,
   "hfov": 11.32
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -2.97,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_1_HS_1_0.png",
      "width": 193,
      "class": "ImageResourceLevel",
      "height": 180
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 9.22,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.32
  }
 ],
 "id": "overlay_90A2A914_8753_E4F4_41D4_600237C1FEFD",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C, this.camera_9A61A7CC_8DCB_BA86_419C_2A902C34084F); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -162.11,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -34.87,
   "hfov": 28.69
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_98582C70_8DC8_4D9E_41D7_E0F602010FAB",
   "yaw": -162.11,
   "pitch": -34.87,
   "hfov": 28.69,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_9E23B303_8DC9_BB82_41D8_DA83A391D355",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF, this.camera_9AFF15A5_8DCB_BE87_41E0_655928A9DC49); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 172.93,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_1_HS_1_0_0_map.gif",
      "width": 17,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.97,
   "hfov": 12.85
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 172.93,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_1_HS_1_0.png",
      "width": 195,
      "class": "ImageResourceLevel",
      "height": 177
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.97,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.85
  }
 ],
 "id": "overlay_9DBF3310_8DC7_DB9D_41D7_00D6F709BEB2",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A, this.camera_9AF70575_8DCB_BF87_41C5_786A0552C480); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -7.37,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.55,
   "hfov": 19.39
  }
 ],
 "data": {
  "label": "Arrow 02a"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_98596C70_8DC8_4D9E_41B2_9458AD57F75E",
   "yaw": -7.37,
   "pitch": -18.55,
   "hfov": 19.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9EEEB638_8DC8_BD8D_41D6_C8A59138198C",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F, this.camera_9AAFE6DC_8DCB_BA86_41CB_A20A1B0BD922); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 99.3,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.2,
   "hfov": 20.48
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998B071C_8DD8_BB86_41D9_7E2D883B276C",
   "yaw": 99.3,
   "pitch": -13.2,
   "hfov": 20.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9678C4D6_872F_2D75_41CE_1FCF04374CBE",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19, this.camera_9A958707_8DCB_BB82_41D6_90AA75771F4F); this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -72.45,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.2,
   "hfov": 15.73
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998B571C_8DD8_BB86_41C0_BD9806771054",
   "yaw": -72.45,
   "pitch": -16.2,
   "hfov": 15.73,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_97B4FEA5_872F_FDD4_41D6_43C9A069FC3D",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_9841E3AB_8735_6BDC_41D2_8CE0CBAAFF29, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3E7CF51_872D_3B4C_4198_292824ACA5F4, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 4.12,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_1_HS_2_0_0_map.gif",
      "width": 18,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.68,
   "hfov": 11.68
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 4.12,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_1_HS_2_0.png",
      "width": 197,
      "class": "ImageResourceLevel",
      "height": 174
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.68,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.68
  }
 ],
 "id": "overlay_988B016A_8735_275D_41B0_326EE3EC9692",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1, this.camera_9698C0DA_8DCB_B682_41D6_25AC5D2EA6CF); this.mainPlayList.set('selectedIndex', 26)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -6.18,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.03,
   "hfov": 16.93
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F256FD_8DD8_BA87_41D2_F5BC45ABDF01",
   "yaw": -6.18,
   "pitch": -11.03,
   "hfov": 16.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9D191D6A_8735_3F5C_41D5_E02C7BE0C629",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294, this.camera_968B510C_8DCB_B786_4196_EF71F8201670); this.mainPlayList.set('selectedIndex', 28)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -89.29,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.93,
   "hfov": 16.96
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998DB6FD_8DD8_BA87_41D5_04EE86A967EA",
   "yaw": -89.29,
   "pitch": -24.93,
   "hfov": 16.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9D5450B4_8733_E534_41D3_3A334F69D74B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19, this.camera_9697C09A_8DCB_B682_41D7_E407D581FCA6); this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 172.71,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -30.12,
   "hfov": 13.8
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998D170C_8DD8_BB86_41D4_DEF05BBD6FEB",
   "yaw": 172.71,
   "pitch": -30.12,
   "hfov": 13.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_999D1075_8753_2537_41E0_1A2D3A3DA884",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_98544939_873F_273C_41DB_0407BA8BEE71, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3EE6F41_872D_3B4F_41D0_91A716500752, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 76.43,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_3_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.45,
   "hfov": 14.57
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 76.43,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_3_0.png",
      "width": 246,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.45,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.57
  }
 ],
 "id": "overlay_A7793960_873F_E74C_41C5_6E2080E6F218",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A, this.camera_9622025D_8DCB_B586_41E0_138A7C5BCCAD); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 4.08,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.58,
   "hfov": 13.64
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F8C6ED_8DD8_BA86_41D8_35F77E81D5DE",
   "yaw": 4.08,
   "pitch": -21.58,
   "hfov": 13.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_8901661B_86B4_5F0B_41CB_0CC399D844F4",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D, this.camera_96142283_8DCB_BA82_41E0_B8F02E763E23); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 177.9,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.26,
   "hfov": 14.34
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F806ED_8DD8_BA86_4177_A0BEE98FB2B6",
   "yaw": 177.9,
   "pitch": -22.26,
   "hfov": 14.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_8940A6C5_86B5_FF7E_41D4_6D72C7E7193B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752, this.camera_9A43784B_8DCB_B582_41BA_236343E69291); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -69.25,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.55,
   "hfov": 20.27
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_9ADEEDF9_8DF8_CE8E_41D5_7BFE1FFF1C24",
   "yaw": -69.25,
   "pitch": -15.55,
   "hfov": 20.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_99CBD7BF_8DF8_5A82_4167_296CC74CF0C8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B, this.camera_9A5CA820_8DCB_B5BE_41A1_A41A47942E64); this.mainPlayList.set('selectedIndex', 25)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 114.84,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.77,
   "hfov": 20.14
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_9ADE4DF9_8DF8_CE8E_41CF_5F29FAE3BDFF",
   "yaw": 114.84,
   "pitch": -16.77,
   "hfov": 20.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9B8F7DD0_8DF8_CE9E_41E0_416048CC779D",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429, this.camera_9A5457F8_8DCB_BA8D_41B1_09A42AA3B7A1); this.mainPlayList.set('selectedIndex', 30)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -88.48,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.91,
   "hfov": 19.38
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998FF70C_8DD8_BB86_41DB_C693855D98CA",
   "yaw": -88.48,
   "pitch": -22.91,
   "hfov": 19.38,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_99B8FF05_87F5_3CD4_41B8_7C94B7C50BE8",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_98663F2D_8733_1CD4_41BF_0453E520DB57, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3E88F41_872D_3B4F_41C3_806E2B1B4FE0, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -18.89,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_1_HS_1_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.86,
   "hfov": 14.56
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -18.89,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_1_HS_1_0.png",
      "width": 246,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.86,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.56
  }
 ],
 "id": "overlay_980426A1_8733_6DCF_41C2_FCA596FAAB5C",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_A751F1C3_8733_674C_41DC_98D6EDF2790A, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3EA7F51_872D_3B4C_41DF_373D27AF8056, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -163.39,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_1_HS_2_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.84,
   "hfov": 7.1
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -163.39,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_1_HS_2_0.png",
      "width": 120,
      "class": "ImageResourceLevel",
      "height": 101
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.84,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.1
  }
 ],
 "id": "overlay_98154E66_8733_3D55_41DE_B9635B62E857",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_98C663D8_873D_2B7C_41E0_D0692A48CA27, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3EC6F41_872D_3B4F_41D1_E9B3F2202E10, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 104.39,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_1_HS_0_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 5.89,
   "hfov": 7.07
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 104.39,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_1_HS_0_0.png",
      "width": 120,
      "class": "ImageResourceLevel",
      "height": 101
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 5.89,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.07
  }
 ],
 "id": "overlay_A7FD3910_873D_64CC_41DC_4D59F0625E78",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B, this.camera_970A6EC4_8DCB_CA86_41DD_3FA28AC17CBE); this.mainPlayList.set('selectedIndex', 25)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 5.1,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.9,
   "hfov": 20.51
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F286FD_8DD8_BA87_41D4_00E3C559F6CF",
   "yaw": 5.1,
   "pitch": -12.9,
   "hfov": 20.51,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_A9D6D15B_88D5_2773_41DC_B120D47AE8C0",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941, this.camera_96EE8F40_8DCB_CBFE_41DF_D509EC8AC89C); this.mainPlayList.set('selectedIndex', 25); this.mainPlayList.set('selectedIndex', 27)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -174.16,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.37,
   "hfov": 18.98
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F2E6FD_8DD8_BA87_41B8_65FD6C1DE1DF",
   "yaw": -174.16,
   "pitch": -23.37,
   "hfov": 18.98,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AA6C9C28_88D3_1CDC_41AC_3C7058C54F50",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B, this.camera_9B1DF4E7_8DCB_BE83_41BD_AEF05661A422); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 7.25,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.82,
   "hfov": 19.91
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998E070C_8DD8_BB86_41C9_960FFCC3DBB1",
   "yaw": 7.25,
   "pitch": -18.82,
   "hfov": 19.91,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9D8002B6_873D_2535_41DB_834F9CF5509F",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD32B36_86BC_551D_41A0_F27558AA8279, this.camera_9B283497_8DCB_BE82_41C9_A27F62070BFE); this.mainPlayList.set('selectedIndex', 29)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -75.39,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.5,
   "hfov": 19.44
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998E470C_8DD8_BB86_41DC_EC9B34706E4A",
   "yaw": -75.39,
   "pitch": -22.5,
   "hfov": 19.44,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9B52EF3D_8733_7B34_41DD_42A0D0F070A4",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8836E539_86BF_FD17_41C8_DCFB05040C19, this.camera_9B1344BD_8DCB_BE86_41CD_A089711D6FBB); this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 101.02,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.11,
   "hfov": 19.63
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_9989D70C_8DD8_BB86_41CB_98210596A96F",
   "yaw": 101.02,
   "pitch": -21.11,
   "hfov": 19.63,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9CA0A3B7_8735_2B34_41CD_B075572D9939",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_A7CFCA49_8733_655F_41DE_E69C3D3FFF36, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3E5AF51_872D_3B4C_41C6_E0BF6E185999, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -155.08,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_3_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.48,
   "hfov": 14.5
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -155.08,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_3_0.png",
      "width": 246,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.48,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.5
  }
 ],
 "id": "overlay_A7FC2C6B_8733_1D53_41CF_0BE794FAC086",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B, this.camera_9B04351B_8DCB_BF83_41E0_215A3B301F73); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -175.83,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.16,
   "hfov": 20.13
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99FA06ED_8DD8_BA86_41C0_7981E2F2D143",
   "yaw": -175.83,
   "pitch": -17.16,
   "hfov": 20.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_90546473_876E_ED4C_41C4_D18EBD41242F",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -6.47,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.85,
   "hfov": 20.36
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99FA66ED_8DD8_BA86_41D8_8AC0154BC553",
   "yaw": -6.47,
   "pitch": -14.85,
   "hfov": 20.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_905E0469_876D_2D5C_41D1_77903D4B2340",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_9845FD4F_8735_3F54_41D5_750F8197E58F, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3F5BF41_872D_3B4F_41D8_139E6AA8B555, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -98.25,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_2_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.91,
   "hfov": 14.53
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": -98.25,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_2_0.png",
      "width": 246,
      "class": "ImageResourceLevel",
      "height": 207
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.91,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.53
  }
 ],
 "id": "overlay_98037F63_8735_1B4C_41D0_EFA77AB9C424",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C, this.camera_9B0CB54A_8DCB_BF82_41D9_C7146EF7EB1D); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -76.86,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 3.28,
   "hfov": 12.25
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F5E6ED_8DD8_BA86_41D1_30A2323D2EB3",
   "yaw": -76.86,
   "pitch": 3.28,
   "hfov": 12.25,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_82E187A2_8DC8_7A82_41DC_1FB087C1EB35",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_88036993_86BB_D51A_41BE_3881D96313A7, this.camera_96D17F88_8DCB_CA8E_41D7_5FD7FFF8238D); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -107.25,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_1_HS_0_0_0_map.gif",
      "width": 24,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.03,
   "hfov": 19.77
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998A071C_8DD8_BB86_41D4_98F247C419BD",
   "yaw": -107.25,
   "pitch": -20.03,
   "hfov": 19.77,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_92AB9F1A_8755_3CFD_41C7_1404F3132C5A",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_884B522F_86BC_F70B_41BE_AB0F60060908, this.camera_96C3EFCF_8DCB_CA82_41B7_6F6E5E5BE6E4); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -167.03,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.41,
   "hfov": 19.96
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_998BC71C_8DD8_BB86_41B5_8A8F5425C623",
   "yaw": -167.03,
   "pitch": -18.41,
   "hfov": 19.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_98B268F1_87ED_E54F_41C7_F6227A3C1932",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_9B651ED2_8DD9_CA82_41D9_882F2ECB1772, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_9741BD3A_8DCB_CF82_41E0_11A39DF8D856, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 13.78,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 21
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -0.4,
   "hfov": 13.36
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 13.78,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_0_HS_2_0.png",
      "width": 225,
      "class": "ImageResourceLevel",
      "height": 306
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -0.4,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.36
  }
 ],
 "id": "overlay_9B6DE5F1_8DD8_5E9E_41B9_4F72A1ACEA88",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_88036993_86BB_D51A_41BE_3881D96313A7, this.camera_972FEE12_8DCB_CD82_41D8_23AB111D544B); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -97.48,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.09,
   "hfov": 19.49
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F476ED_8DD8_BA86_41D8_893DB989BFD4",
   "yaw": -97.48,
   "pitch": -22.09,
   "hfov": 19.49,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_95FED02A_86D5_D335_41D2_D1A84AD6E834",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294, this.camera_9706BE8A_8DCB_CA83_41C9_DBC8FFBF7FA5); this.mainPlayList.set('selectedIndex', 28)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -5.84,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.77,
   "hfov": 20.14
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F7D6ED_8DD8_BA86_41CC_D3B26ECDDFD0",
   "yaw": -5.84,
   "pitch": -16.77,
   "hfov": 20.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_949E700A_86DC_D2F5_41CE_B4FB3C0523C6",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 100.3,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_2_0_0_map.gif",
      "width": 17,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.04,
   "hfov": 4.12
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 100.3,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_2_0.png",
      "width": 69,
      "class": "ImageResourceLevel",
      "height": 64
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.04,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.12
  }
 ],
 "id": "overlay_9925B3DA_872F_2B7D_41DD_E1A5ACFAAF85",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 93.44,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_3_0_0_map.gif",
      "width": 20,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.4,
   "hfov": 3.91
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 93.44,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_3_0.png",
      "width": 66,
      "class": "ImageResourceLevel",
      "height": 51
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.4,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 3.91
  }
 ],
 "id": "overlay_999A94EF_872F_ED53_41A0_DEA748214527",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F, this.camera_97130E4D_8DCB_CD86_41D4_4933F6CD9F32); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 84.16,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_4_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.86,
   "hfov": 19.66
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F696ED_8DD8_BA86_4183_CD24BA6AD5F1",
   "yaw": 84.16,
   "pitch": -20.86,
   "hfov": 19.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AC185CF1_8955_3D4C_4180_DB7331AC64FB",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_98E8FAEB_873D_2553_4161_2BD881736DF9, {'pressedIconColor':'#888888','pressedBackgroundColorDirection':'vertical','rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','pressedBorderColor':'#000000','iconHeight':20,'paddingLeft':5,'paddingRight':5,'rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'rollOverIconLineWidth':5,'rollOverIconWidth':20,'borderSize':0,'rollOverBorderColor':'#000000','pressedBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingTop':5,'pressedIconLineWidth':5,'rollOverIconHeight':20,'backgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconWidth':20,'iconColor':'#000000','pressedBackgroundOpacity':0.3,'paddingBottom':5,'pressedBorderSize':0,'iconWidth':20,'iconLineWidth':5,'rollOverBorderSize':0,'rollOverIconColor':'#666666','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'backgroundOpacity':0.3,'borderColor':'#000000'}, this.ImageResource_A3F2BF41_872D_3B4F_41C7_8C3F6E2280DA, null, null, null, null, false)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 114.32,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_1_HS_0_0_0_map.gif",
      "width": 19,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.47,
   "hfov": 7.11
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "yaw": 114.32,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_1_HS_0_0.png",
      "width": 119,
      "class": "ImageResourceLevel",
      "height": 100
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.47,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.11
  }
 ],
 "id": "overlay_982A02E8_8732_E55D_41D9_C97C9CE44528",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74, this.camera_9609E2D5_8DCB_BA86_41C9_A6CF0D845B28); this.mainPlayList.set('selectedIndex', 24)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -7.07,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18,
   "hfov": 20.01
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F066FD_8DD8_BA87_41E1_3DDF055BB655",
   "yaw": -7.07,
   "pitch": -18,
   "hfov": 20.01,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AA55BA05_892D_24D7_41D0_317621F6F7CF",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1, this.camera_9606B2AB_8DCB_BA82_41BD_8FB9E8CA5EC1); this.mainPlayList.set('selectedIndex', 26)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 173.34,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.12,
   "hfov": 16.52
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F3C6FD_8DD8_BA87_41D0_538749EB2185",
   "yaw": 173.34,
   "pitch": -19.12,
   "hfov": 16.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_AC443EF6_892F_FD35_41D0_31DE6852D4F6",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B, this.camera_96339229_8DCB_B58F_41D1_CC05997EC874); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 89.06,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.36,
   "hfov": 20.19
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F556ED_8DD8_BA86_41D6_B6D851510222",
   "yaw": 89.06,
   "pitch": -16.36,
   "hfov": 20.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_889849F2_8733_274C_41C5_20DE8F8CD49B",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72, this.camera_964161FD_8DCB_B686_41D8_AA48B0456F81); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -5.84,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.77,
   "hfov": 20.14
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F4B6ED_8DD8_BA86_41D9_1BEAA46D888C",
   "yaw": -5.84,
   "pitch": -16.77,
   "hfov": 20.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_960BDF4A_8732_FB5C_41A2_9838407CF0FA",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0, this.camera_965EA1C0_8DCB_B6FE_41D2_24652741A45B); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -93.39,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.32,
   "hfov": 20.39
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99F436ED_8DD8_BA86_41C6_2E9E588F2BC1",
   "yaw": -93.39,
   "pitch": -14.32,
   "hfov": 20.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_967BDC18_872D_3CFC_41BB_B49C1DECA5EF",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F, this.camera_9A8E7757_8DCB_BB82_41DF_B51AA419B1AA); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 2.34,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.55,
   "hfov": 20.27
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99FB16ED_8DD8_BA86_41B1_D26AE3EC2F0B",
   "yaw": 2.34,
   "pitch": -15.55,
   "hfov": 20.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_8AA540D9_873D_257F_41B0_D4BA1D778B9E",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429, this.camera_9A986729_8DCB_BB8F_41AF_4C2B28C31BCA); this.mainPlayList.set('selectedIndex', 30)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": 91.52,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.5,
   "hfov": 20.46
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99FB56ED_8DD8_BA86_41BE_C8526247A503",
   "yaw": 91.52,
   "pitch": -13.5,
   "hfov": 20.46,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_8ADB45C6_8735_6F55_41AF_7283681BFC99",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A, this.camera_9A7AF7A2_8DCB_BA82_419C_4DBD0ABD3E4D); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -50.44,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.64,
   "hfov": 19.82
  }
 ],
 "data": {
  "label": "Arrow 05b"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_99FAB6ED_8DD8_BA86_41AB_DBE051AF0694",
   "yaw": -50.44,
   "pitch": -19.64,
   "hfov": 19.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9E419280_8755_25CD_41A4_30127A7559BA",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF, this.camera_9A74E77A_8DCB_BB83_41DA_EF0C5510F8B1); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "yaw": -171.17,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "levels": [
     {
      "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0_HS_4_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.18,
   "hfov": 18.94
  }
 ],
 "data": {
  "label": "Arrow 02a"
 },
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_9F5E3FFE_8DC8_4A82_41D3_0DA348E520E0",
   "yaw": -171.17,
   "pitch": -22.18,
   "hfov": 18.94,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_9FC03247_8DC9_D582_4175_5D9C9316FA19",
 "rollOverDisplay": false,
 "enabledInCardboard": true
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F866ED_8DD8_BA86_41D6_33A5B2D29BA0",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD00B1E_86BC_F50A_41BF_667B7A7CAE1A_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99FBC6ED_8DD8_BA86_41DA_80C70E9D61FC",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F646FD_8DD8_BA87_41D7_D01A251E956E",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AC4D61C_86BC_DF0D_41C6_909D43608752_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F196FD_8DD8_BA87_41DF_E0C507BED69C",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_9988870C_8DD8_BB86_41C9_6C9CFFDBF5E2",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_9988F70C_8DD8_BB86_41BF_081C7DAB76EC",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8836E539_86BF_FD17_41C8_DCFB05040C19_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_9988470C_8DD8_BB86_41C8_14CCCB36FFFE",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998CD70C_8DD8_BB86_41C6_3B656A6542BF",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998C370C_8DD8_BB86_41AF_6963F85FD338",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD4712E_86BC_B50D_41D4_2A5B6C64B294_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998F870C_8DD8_BB86_41DD_EE333D14BAF6",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F736ED_8DD8_BA86_41DC_40377BE7A908",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_884B522F_86BC_F70B_41BE_AB0F60060908_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F686ED_8DD8_BA86_41D6_2A29687F69CB",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F6E6ED_8DD8_BA86_41D9_9CD822922A92",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_88036993_86BB_D51A_41BE_3881D96313A7_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F7C6ED_8DD8_BA86_41CE_A0AAAFC8420B",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8ACD92E7_86BC_573B_41D3_ECDC1A71CA9D_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99FED6DD_8DD8_BA86_41C2_A4DC0A91999D",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_80D06EAA_8DC8_4A8D_41D0_0DC1E6528B9A_0_HS_0_0.png",
   "width": 560,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_98582C70_8DC8_4D9E_41D7_E0F602010FAB",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8143966F_8DC8_FD82_41CF_5646F6EB491C_0_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_98596C70_8DC8_4D9E_41B2_9458AD57F75E",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998B071C_8DD8_BB86_41D9_7E2D883B276C",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A398A34_86BF_D71D_41D4_F394D0B1AF72_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998B571C_8DD8_BB86_41C0_BD9806771054",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F256FD_8DD8_BA87_41D2_F5BC45ABDF01",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998DB6FD_8DD8_BA87_41D5_04EE86A967EA",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_89DEAC08_86BC_72F6_41C1_C628DDB6D941_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998D170C_8DD8_BB86_41D4_DEF05BBD6FEB",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F8C6ED_8DD8_BA86_41D8_35F77E81D5DE",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_89F7FE2B_86BC_CF0B_41CA_94C5BD0F49ED_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F806ED_8DD8_BA86_4177_A0BEE98FB2B6",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_9ADEEDF9_8DF8_CE8E_41D5_7BFE1FFF1C24",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_898A1C72_86BD_F31A_41DE_1384F46F3D74_0_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_9ADE4DF9_8DF8_CE8E_41CF_5F29FAE3BDFF",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD32B36_86BC_551D_41A0_F27558AA8279_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998FF70C_8DD8_BB86_41DB_C693855D98CA",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F286FD_8DD8_BA87_41D4_00E3C559F6CF",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD1E7F5_86BC_5D1F_41DC_EBF48F97DFC1_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F2E6FD_8DD8_BA87_41B8_65FD6C1DE1DF",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998E070C_8DD8_BB86_41C9_960FFCC3DBB1",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998E470C_8DD8_BB86_41DC_EC9B34706E4A",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A3BA068_86BF_D336_41D1_9967BD4EB429_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_9989D70C_8DD8_BB86_41CB_98210596A96F",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99FA06ED_8DD8_BA86_41C0_7981E2F2D143",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99FA66ED_8DD8_BA86_41D8_8AC0154BC553",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_898B1D12_86B4_4D15_41D4_DB00897CF0EF_1_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F5E6ED_8DD8_BA86_41D1_30A2323D2EB3",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_1_HS_0_0.png",
   "width": 560,
   "class": "ImageResourceLevel",
   "height": 540
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998A071C_8DD8_BB86_41D4_98F247C419BD",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD1836F_86BC_750A_41C7_51718FF3FE08_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_998BC71C_8DD8_BB86_41B5_8A8F5425C623",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F476ED_8DD8_BA86_41D8_893DB989BFD4",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F7D6ED_8DD8_BA86_41CC_D3B26ECDDFD0",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8AD0E5EF_86BC_DD0A_41B1_98F1D0BC35D0_1_HS_4_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F696ED_8DD8_BA86_4183_CD24BA6AD5F1",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F066FD_8DD8_BA87_41E1_3DDF055BB655",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_881520A8_86BD_B335_41B7_95FFE4EFE94B_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F3C6FD_8DD8_BA87_41D0_538749EB2185",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F556ED_8DD8_BA86_41D6_B6D851510222",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F4B6ED_8DD8_BA86_41D9_1BEAA46D888C",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8820CE31_86BC_4F17_41D3_B363835DEE5F_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99F436ED_8DD8_BA86_41C6_2E9E588F2BC1",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99FB16ED_8DD8_BA86_41B1_D26AE3EC2F0B",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99FB56ED_8DD8_BA86_41BE_C8526247A503",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_99FAB6ED_8DD8_BA86_41AB_DBE051AF0694",
 "colCount": 4
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A38172F_86BC_7D0B_41B8_23387D5A3C7B_0_HS_4_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "rowCount": 6,
 "id": "AnimatedImageResource_9F5E3FFE_8DC8_4A82_41D3_0DA348E520E0",
 "colCount": 4
}],
 "scrollBarColor": "#000000",
 "desktopMipmappingEnabled": false,
 "paddingTop": 0,
 "gap": 10,
 "mouseWheelEnabled": true,
 "backgroundPreloadEnabled": true,
 "scrollBarOpacity": 0.5,
 "mobileMipmappingEnabled": false,
 "propagateClick": false,
 "paddingBottom": 0,
 "data": {
  "name": "Player4472"
 },
 "overflow": "visible",
 "vrPolyfillScale": 0.5
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
