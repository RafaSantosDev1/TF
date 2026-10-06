using Backend.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Infrastructure.Data.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Title).IsRequired();
        builder.Property(q => q.Content).IsRequired();
        builder.Property(q => q.CreatedAt).IsRequired();

        builder.Property(q => q.Area)
            .HasConversion<string>()
            .IsRequired();

        builder.HasOne(q => q.Author)
            .WithMany(u => u.Questions)
            .HasForeignKey(q => q.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(q => q.AcceptedAnswer)
            .WithMany()
            .HasForeignKey(q => q.AcceptedAnswerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(q => q.AcceptedAnswerId).IsUnique();
    }
}