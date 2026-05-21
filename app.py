from flask import (
    Flask,
    render_template,
    request,
    jsonify
)

from flask_sqlalchemy import (
    SQLAlchemy
)

from datetime import (
    datetime
)

import os


app = Flask(__name__)


# ==========================
# DATABASE CONFIG
# ==========================
BASE_DIR = os.path.abspath(
    os.path.dirname(__file__)
)

db_path = os.path.join(
    BASE_DIR,
    "todo.db"
)

app.config[
    'SQLALCHEMY_DATABASE_URI'
] = f"sqlite:///{db_path}"

app.config[
    'SQLALCHEMY_TRACK_MODIFICATIONS'
] = False

db = SQLAlchemy(app)


# ==========================
# DATABASE MODEL
# ==========================
class Task(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    completed = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):

        return {

            "id":
            self.id,

            "title":
            self.title,

            "description":
            self.description,

            "completed":
            self.completed,

            "created_at":
            self.created_at.strftime(
                "%d %b %Y, %I:%M %p"
            )
        }


# ==========================
# HOME PAGE
# ==========================
@app.route('/')
def home():

    return render_template(
        'index.html'
    )


# ==========================
# GET ALL TASKS
# ==========================
@app.route(
    '/api/tasks',
    methods=['GET']
)
def get_tasks():

    tasks = (
        Task.query
        .order_by(
            Task.created_at.desc()
        )
        .all()
    )

    return jsonify(
        [
            task.to_dict()
            for task in tasks
        ]
    )


# ==========================
# ADD TASK
# ==========================
@app.route(
    '/api/tasks',
    methods=['POST']
)
def add_task():

    data = request.json

    title = data.get(
        'title'
    )

    description = data.get(
        'description'
    )

    if (
        not title or
        not description
    ):

        return jsonify({

            'message':
            'All fields are required'

        }), 400

    task = Task(

        title=title,
        description=
        description
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({

        'message':
        'Task Added Successfully'

    })


# ==========================
# UPDATE TASK
# ==========================
@app.route(
    '/api/tasks/<int:id>',
    methods=['PUT']
)
def update_task(id):

    task = db.session.get(
        Task,
        id
    )

    if not task:

        return jsonify({

            'message':
            'Task not found'

        }), 404

    data = request.json

    task.title = data.get(
        'title',
        task.title
    )

    task.description = data.get(
        'description',
        task.description
    )

    if 'completed' in data:

        task.completed = data[
            'completed'
        ]

    db.session.commit()

    return jsonify({

        'message':
        'Task Updated'

    })


# ==========================
# DELETE TASK
# ==========================
@app.route(
    '/api/tasks/<int:id>',
    methods=['DELETE']
)
def delete_task(id):

    task = db.session.get(
        Task,
        id
    )

    if not task:

        return jsonify({

            'message':
            'Task not found'

        }), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({

        'message':
        'Task Deleted'

    })


# ==========================
# MAIN
# ==========================
if __name__ == '__main__':

    with app.app_context():
        db.create_all()

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )