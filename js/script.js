$(function() {
    var progressDiv = $('#progress');

    if(progressDiv.length) {
        getMilestones(progressDiv);
    }
});

function getMilestones(el) {
    var container = $(el);
    var url = 'https://api.github.com/repos/ktu-pokemonai/inzinerija/milestones';
    var templateUrl = container.data('template');

    $.get(templateUrl, function(template) {
        $.get(url, {'state': 'all'}, function(data) {

            container.html('<div class="list-group">');

            $.each(data, function(i, el) {
                var html = template;
                var progress = getProgress(el);
                var dueDate = getDueDate(el);

                html = html.replace(/__TITLE__/g, el.title);
                html = html.replace(/__DESCRIPTION__/g, el.description);
                html = html.replace(/__PROGRESS__/g, progress + '%');
                html = html.replace(/__DATE__/g, dueDate);

                var item = $(html);

                if(el.state != 'closed') {
                    item.addClass('list-group-item-info');
                }

                container.append(item);
            });

            container.append('</div>');
        }, 'json');
    }, 'html');

    function getDueDate(milestone)
    {
        var dueDate = new Date(milestone.due_on);
        var result = [];

        result.push(dueDate.getFullYear());
        result.push(padNumber(dueDate.getMonth() + 1));
        result.push(padNumber(dueDate.getDate()));

        return result.join('-');
    }

    function getProgress(milestone)
    {
        var totalIssues = milestone.open_issues + milestone.closed_issues;
        var closedIssues = milestone.closed_issues;
        var result = closedIssues / totalIssues;

        return Math.floor(result * 100);
    }

    function padNumber(number)
    {
        if(number <= 9) {
            return '0' + number;
        }

        return number;
    }
}