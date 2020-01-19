<?php

declare(strict_types=1);

namespace DoctrineMigrations;


use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200119202726 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Generate first admin users';
    }

    public function up(Schema $schema): void
    {
        $data = [
                'email' => 'admin@admin.pl',
                'roles' => '["ROLE_ADMIN"]',
                'password' => '$2y$13$2D74vOK7wq6d11PuYAxcOeLgBeUHjplHD.HpGnNVVVYabMfzL8Ama'
        ];
        $this->connection->insert('user', $data);
    }

    public function down(Schema $schema): void
    {
        $this->connection->delete('user', ['email' => 'admin@admin.pl']);
    }
}

