$(function() {
    'use strict';

    //mark tasks as done
    $.each($('.task'), function(key, taskElement) {
        if (localStorage.getItem($(taskElement).attr('id')) === "true") {
            $(taskElement).addClass('done');
            $(taskElement).find('input.task-done').prop('checked', true);
        }
    });

    // Show project details when teaser is clicked.
    $('.task').click(function(event) {

        var clickedTask = event.target,
            previouslyOpened = $(clickedTask).parent().find('.opened-task');

        if ($(clickedTask).hasClass('done')) {
            $(clickedTask).find('input.task-done').prop('checked', true);
        }
        
        // Close any already opened details in this section
        $(clickedTask).siblings('.task-details').remove();
        previouslyOpened.removeClass('expanded-project');

        // Only proceed if clicked item is not the same as previously expanded one
        if(previouslyOpened[0] !== clickedTask) {

            var clickedTaskOffsetTop = $(clickedTask).offset().top;
            var lastItemInLine = undefined;

            $.each($(clickedTask).parent().find('.task'), function(key, taskElement) {
                if ($(taskElement).offset().top !== clickedTaskOffsetTop) {
                    return;
                }
                lastItemInLine = taskElement;
            });

            var newDetailElement = $(clickedTask).find('.task-details').clone();
            newDetailElement.insertAfter(lastItemInLine);
            $(clickedTask).addClass('.opened-task');

            // Append close button to project description
            newDetailElement.append('<i class=\'close-icon\' />');

            // add close action to close button
            $('.task-details .close-icon').click(function(event) {
                $(event.target).parent().remove();
            });
        }

        $('.task-done').change(function(event) {
            var id = $(event.target).closest('.task-details').data('id');
            if (event.target.checked === true) {
                $('#' + id).addClass('done');
            } else {
                $('#' + id).removeClass('done');
            }
            localStorage.setItem(id, event.target.checked);
        });

    });

});