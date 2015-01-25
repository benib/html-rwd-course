(function(bb, $) {
    'use strict';

    bb.Task = function(config) {
        this.$task      = config.taskElement;
        this.id         = this.$task.attr('id');
        this.beforeOpen = config.beforeOpen;

        this.detailState = 'closed';

        this.$detailElement = this.$task.find('.task-details');

        this.loadFromLocalStorage();

        //bind click action
        this.$task.on('click', function(event) {
            if (this.detailState == 'closed') {
                this.beforeOpen.call(this);
                this.showDetail();
            } else {
                this.hideDetail();
            }
        }.bind(this));

        //add close icon and action
        this.$detailElement.append('<i class=\'close-icon\' />');
        this.$detailElement.find('.close-icon').on('click', function(event) {
            this.hideDetail();
        }.bind(this));

        this.$task.find('.task-done').change(function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (event.target.checked) {
                this.markDone();
            } else {
                this.markUndone();
            }
        }.bind(this));
    }

    bb.Task.prototype.loadFromLocalStorage = function() {
        if (localStorage.getItem(this.id) === "true") {
            this.markDone();
        }
    }

    bb.Task.prototype.markDone = function() {
        this.$task.addClass('done');
        this.$task.find('input.task-done').prop('checked', true);
        localStorage.setItem(this.id, true);
    }

    bb.Task.prototype.markUndone = function() {
        this.$task.removeClass('done');
        this.$task.find('input.task-done').prop('checked', false);
        localStorage.removeItem(this.id);
    }

    bb.Task.prototype.showDetail = function() {
        this.$task.addClass('expanded-project');
        this.$detailElement.insertAfter(this.getLastTaskElementInLine());
        this.detailState = 'opened';
    }

    bb.Task.prototype.hideDetail = function() {
        this.$task.removeClass('expanded-project');
        this.$detailElement.appendTo(this.$task);
        this.detailState = 'closed';
    }

    bb.Task.prototype.hasSameParent = function(task) {
        return task.getParentElement()[0] == this.getParentElement()[0]
    }

    bb.Task.prototype.getParentElement = function(task) {
        return this.$task.parent();
    }

    bb.Task.prototype.getLastTaskElementInLine = function() {
        var offsetTop         = this.$task.offset().top;
        var lastItemInLine = undefined;

        $.each(this.getParentElement().find('.task'), function(key, taskElement) {
            if ($(taskElement).offset().top !== offsetTop) {
                return;
            }
            lastItemInLine = taskElement;
        });
        return $(lastItemInLine);
    }

    bb.tasks = [];

    $.each($('.task'), function(key, taskElement) {
        bb.tasks.push(new bb.Task({
            taskElement: $(taskElement),
            beforeOpen: function() {
                bb.tasks.forEach(function(task, index) {
                    if (this.hasSameParent(task) && this != task) {
                        task.hideDetail();
                    }
                },this);
            }
        }));
    });



})(bb = window.bb || {}, jQuery);
