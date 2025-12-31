import sys
import sqlite3

def main():
    if len(sys.argv) != 2:
        print('usage: check_db.py path/to/db')
        return 2
    path = sys.argv[1]
    try:
        conn = sqlite3.connect(path)
        cur = conn.execute('PRAGMA integrity_check;')
        row = cur.fetchone()
        conn.close()
        if row and (row[0] == 'ok' or row[0] == b'ok'):
            print('ok')
            return 0
        print('not-ok', row)
        return 1
    except Exception as e:
        print('error', e)
        return 2

if __name__ == '__main__':
    sys.exit(main())
